const username = new URL(window.location).searchParams.get('username');

window.addEventListener('load', () => {

  const socket = io();
  socket.emit('register', username);
  socket.on('success', () => {
    document.querySelector('#options').remove();
    document.querySelector('#success_msg').classList.remove('d-none');
    window.parent.postMessage({ success: true }, '*');
  });

  const pushBtn = document.querySelector('#btn_send_push');
  pushBtn.addEventListener('click', e => {
    fetch('/android/authenticate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'retarded'
      })
    }).catch(err => {
      console.log(err);
    });

    // Also iOS
    fetch('/ios/authenticate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'retarded'
      })
    }).catch(err => {
      console.log(err);
    });
  });
  
})