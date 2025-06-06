import React, { useState, useEffect } from 'react';
import { useGuitar } from '../../../guitarContext';
import { notes } from '../../../lib/constants';
// Assuming noteIndex and indexNote might not be strictly needed if parsing/constructing manually
// but will include them for now as per instructions.
import { noteIndex, indexNote } from '../../../lib/helpers';

const OCTAVE_RANGE = [0, 1, 2, 3, 4, 5, 6, 7, 8];

function Tuning() {
  const { tuning, setTuning } = useGuitar();

  if (!tuning) {
    // Handle case where tuning might not be available yet, though context setup should prevent this.
    return <div>Loading tuning...</div>;
  }

  const handleNoteChange = (stringIndex, newPitch) => {
    const oldNote = tuning[stringIndex];
    const oldOctave = oldNote.slice(-1);
    const newTune = [...tuning];
    newTune[stringIndex] = newPitch + oldOctave;
    setTuning(newTune);
  };

  const handleOctaveChange = (stringIndex, newOctave) => {
    const oldNote = tuning[stringIndex];
    const oldPitch = oldNote.slice(0, -1);
    const newTune = [...tuning];
    newTune[stringIndex] = oldPitch + newOctave;
    setTuning(newTune);
  };

  return (
    <div className="tuning-widget">
      <h3>Tuning</h3>
      {tuning.map((note, stringIndex) => {
        const currentPitch = note.slice(0, -1);
        const currentOctave = parseInt(note.slice(-1), 10);

        return (
          <div key={stringIndex} className="string-tuning-controls">
            <span>String {stringIndex + 1}: </span>
            <select
              value={currentPitch}
              onChange={(e) => handleNoteChange(stringIndex, e.target.value)}
              aria-label={`String ${stringIndex + 1} note`}
            >
              {notes.map((pitchName) => (
                <option key={pitchName} value={pitchName}>
                  {pitchName}
                </option>
              ))}
            </select>
            <select
              value={currentOctave}
              onChange={(e) => handleOctaveChange(stringIndex, parseInt(e.target.value, 10))}
              aria-label={`String ${stringIndex + 1} octave`}
            >
              {OCTAVE_RANGE.map((octaveValue) => (
                <option key={octaveValue} value={octaveValue}>
                  {octaveValue}
                </option>
              ))}
            </select>
          </div>
        );
      })}
    </div>
  );
}

export default Tuning;
