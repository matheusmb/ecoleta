import React from 'react';
import { BsCheckCircle } from 'react-icons/bs';

const SuccessSplash = () => {
  return (
    <div className="overlay">
      <div className="content">
        <span>
          <BsCheckCircle />
        </span>
        <p>Cadastro Concluido!</p>
      </div>
    </div>
  );
};

export default SuccessSplash;
