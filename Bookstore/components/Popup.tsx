import React from 'react';

function Popup(props) {
  return (
    <div className="popup">
      <div className="popup-inner" style={{ backgroundColor: 'white' }}>
        <p style={{ color: 'black' }}>{props}</p>
        <button onClick={props.onClose} style={{ color: 'black' }}>Close</button>
      </div>
    </div>
  );
}

export default Popup;