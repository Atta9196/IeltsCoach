import React from 'react';

const PracticeCard = ({ title, description, type }) => {
  return (
    <div className="practice-card">
      <h3>{title}</h3>
      <p>{description}</p>
      <span className="card-type">{type}</span>
    </div>
  );
};

export default PracticeCard;

