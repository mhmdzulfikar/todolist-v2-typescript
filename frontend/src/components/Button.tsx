import React from 'react';

// 1. Definisikan Props
interface ButtonProps {
  label: string;
  onClick: () => void; // Function yang tidak mengembalikan apa-apa
  variant?: 'primary' | 'danger'; // Cuma boleh pilih salah satu string ini
}

const Button = ({ label, onClick, variant = 'primary' }: ButtonProps) => {
  const color = variant === 'primary' ? 'blue' : 'red';
  
  return (
    <button 
      onClick={onClick}
      style={{ backgroundColor: color, color: 'white', padding: '10px' }}
    >
      {label}

      {/* <Button label="klik gue" onClick={() => alert("hore")} variant="danger" /> */}
    </button>
  );
};

export default Button;