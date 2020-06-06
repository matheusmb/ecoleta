import React, { useState, useEffect } from 'react';
import { BsCheckCircle } from 'react-icons/bs';

interface SplashProps {
  show: boolean;
  onClick?: () => void;
}

const SuccessSplash: React.FC<SplashProps> = ({ show, onClick }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!!show);
  }, [show]);
  return (
    <div onClick={onClick}>
      {visible && (
        <div className="overlay">
          <div className="content">
            <span>
              <BsCheckCircle />
            </span>
            <p>Cadastro Concluido!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuccessSplash;
