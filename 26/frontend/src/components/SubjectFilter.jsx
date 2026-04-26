import React from 'react';

const SubjectFilter = ({ subjects, selectedSubject, onSelectSubject }) => {
  const allSubjects = ['All', ...subjects];

  return (
    <div className="subject-filter">
      <h3>📂 Filter by Subject</h3>
      
      <div className="filter-options">
        {allSubjects.map((subject) => (
          <button
            key={subject}
            className={`filter-btn ${selectedSubject === subject ? 'active' : ''}`}
            onClick={() => onSelectSubject(subject)}
          >
            {subject}
            {subject === 'All' && (
              <span className="count-badge">
                {subjects.reduce((total, subj) => {
                  // This would need actual note counts per subject
                  return total + 1;
                }, 0)}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="filter-info">
        <p>
          <strong>{selectedSubject === 'All' ? 'All Subjects' : selectedSubject}</strong>
          {selectedSubject !== 'All' && ' selected'}
        </p>
        <p className="hint">
          Click a subject to view only its notes
        </p>
      </div>

      {subjects.length === 0 && (
        <div className="no-subjects">
          <p>No subjects yet. Add your first note to create a subject!</p>
        </div>
      )}
    </div>
  );
};

export default SubjectFilter;