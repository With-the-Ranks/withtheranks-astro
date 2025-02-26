const styles = `
  .form-container {
    background: #282D55;
    border-radius: 24px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }
  
  .solid-button {
    background-color: #8C9DFF;
    border-radius: 100px;
    transition: all 0.3s ease;
  }
  
  .solid-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(140, 157, 255, 0.3);
  }
  
  .card {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .highlight-card {
    background: #FFE872;
    color: #282D55;
    border-radius: 16px;
  }
  
  .secondary-card {
    background: #7FFFD4;
    color: #282D55;
    border-radius: 16px;
  }
  
  .tertiary-card {
    background: #8C9DFF;
    color: #282D55;
    border-radius: 16px;
  }
  
  .tag {
    font-size: 12px;
    font-weight: 600;
    padding: 4px 12px;
    border-radius: 100px;
    background: rgba(0, 0, 0, 0.1);
    display: inline-block;
    margin-bottom: 8px;
  }

  .read-more {
    display: inline-flex;
    align-items: center;
    font-weight: 600;
    font-size: 14px;
    color: inherit;
    opacity: 0.8;
    transition: all 0.2s ease;
  }

  .read-more:hover {
    opacity: 1;
  }
`

export default styles

