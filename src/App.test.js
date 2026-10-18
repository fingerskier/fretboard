import React from 'react'
import {fireEvent, render, screen, within} from '@testing-library/react'
import App, {PHONE_QUERY} from './App'


const mockViewport = phone => {
  window.matchMedia = query => ({
    matches: phone && query === PHONE_QUERY,
    addEventListener: () => {},
    removeEventListener: () => {},
  })
}

beforeEach(() => localStorage.clear())
afterEach(() => { delete window.matchMedia })


test('desktop: the circle of fifths changes the key and its spelling', () => {
  mockViewport(false)
  render(<App />)

  expect(screen.getByRole('heading', {name: 'G major'})).toBeInTheDocument()

  fireEvent.click(screen.getByRole('button', {name: 'F major, 1♭'}))
  expect(screen.getByRole('heading', {name: 'F major'})).toBeInTheDocument()
  const degrees = screen.getByRole('group', {name: /Scale notes/})
  expect(within(degrees).getAllByRole('button').map(b => b.firstChild.textContent)).toEqual(['F', 'G', 'A', 'B♭', 'C', 'D', 'E'])

  fireEvent.click(screen.getByRole('button', {name: 'D minor, 1♭'}))
  expect(screen.getByRole('heading', {name: 'D natural minor'})).toBeInTheDocument()
})


test('desktop: the circle keeps a mode of the same family', () => {
  mockViewport(false)
  render(<App />)

  fireEvent.change(screen.getByRole('combobox', {name: 'Mode'}), {target: {value: 'dorian'}})
  fireEvent.click(screen.getByRole('button', {name: 'E minor, 1♯'}))

  expect(screen.getByRole('heading', {name: 'E dorian'})).toBeInTheDocument()
})


test('choosing a chord and a position do not undo each other', () => {
  mockViewport(false)
  render(<App />)

  fireEvent.change(screen.getByRole('combobox', {name: 'Chord'}), {target: {value: '4'}})
  fireEvent.click(screen.getByRole('button', {name: 'Move the position toward the body'}))

  expect(screen.getByRole('combobox', {name: 'Chord'})).toHaveValue('4')
  expect(screen.getByText('Open to fret 3')).toBeInTheDocument()
  expect(screen.getByText(/V D: D R · F♯ 3 · A 5/)).toBeInTheDocument()
})


test('phone: key sheet opens from the header and closes with Done', () => {
  mockViewport(true)
  render(<App />)

  fireEvent.click(screen.getByRole('button', {name: /^G major/}))
  const sheet = screen.getByRole('dialog', {name: 'Key'})

  fireEvent.click(within(sheet).getByRole('button', {name: 'A minor, no ♯/♭'}))
  fireEvent.click(within(sheet).getByRole('button', {name: 'Done'}))

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(screen.getByRole('button', {name: /^A natural minor/})).toBeInTheDocument()
})


test('phone: Tab stays inside an open sheet and the app behind it is inert', () => {
  mockViewport(true)
  render(<App />)
  
  fireEvent.click(screen.getByRole('button', {name: /^G major/}))
  const sheet = screen.getByRole('dialog', {name: 'Key'})
  const done = within(sheet).getByRole('button', {name: 'Done'})
  const mode = within(sheet).getByRole('combobox', {name: 'Mode'})
  
  done.focus()
  fireEvent.keyDown(sheet, {key: 'Tab', shiftKey: true})
  expect(document.activeElement).toBe(mode)
  
  fireEvent.keyDown(sheet, {key: 'Tab'})
  expect(document.activeElement).toBe(done)
  
  expect(document.querySelector('.phone-top')).toHaveAttribute('inert')
  fireEvent.keyDown(sheet, {key: 'Escape'})
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(document.querySelector('.phone-top')).not.toHaveAttribute('inert')
})


test('a migrated tuning keeps octaves outside the usual range', () => {
  mockViewport(false)
  localStorage.setItem('guitarTuning', JSON.stringify(['e0', 'a2', 'd3', 'g3', 'b3', 'e4']))
  render(<App />)
  
  fireEvent.click(screen.getByRole('button', {name: 'Edit strings'}))
  expect(screen.getByRole('combobox', {name: 'String 6 (low) octave'})).toHaveValue('0')
  expect(screen.getByRole('combobox', {name: 'String 6 (low) note'})).toHaveValue('4')
})


test('an old saved tuning with the octave-low high string is repaired', () => {
  mockViewport(false)
  localStorage.setItem('guitarTuning', JSON.stringify(['e2', 'a2', 'd3', 'g3', 'b3', 'e3']))
  render(<App />)

  expect(screen.getByRole('combobox', {name: 'Tuning'})).toHaveValue('standard')
})
