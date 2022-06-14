const sendBtn = document.querySelector("#sendButton");
const messages = document.querySelector("#messages");
const messageBox = document.querySelector("#messageBox");
const sendJokeBtn = document.querySelector(".sendJoke");

let ws;

function sendJoke() {
    let joke;
    const options = {
        method: 'GET',
        url: 'https://dad-jokes.p.rapidapi.com/random/joke',
        headers: {
            'X-RapidAPI-Key': '5ec7db0481msh606aa6fd696a773p1bbb44jsnea78241aeccd',
            'X-RapidAPI-Host': 'dad-jokes.p.rapidapi.com'
        }
    };

    axios.request(options).then(function (response) {
        console.log(response.data.body[0].setup + " " + response.data.body[0].punchline);
        joke = response.data.body[0].setup + "\n" + response.data.body[0].punchline;
        ws.send(joke);
        showMessage(joke, true);
    }).catch(function (error) {
        console.error(error);
    });

}

sendJokeBtn.onclick = () => {
    sendJoke();
}

function showMessage(message, isMine=false) {
    messages.innerHTML += `
                   <div class="message-row ${isMine ? "sent" : "received"}"><div class="blob">${message}</div></div>
                `;
    messageBox.value = "";
}

function init() {
    if(ws) {
        ws.onerror = ws.onopen = ws.onclose = null;
        ws.close();
    }
    ws = new WebSocket('ws://localhost:6969');
    ws.onopen = () => {
        console.log("Connection opened!");
    }
    ws.onmessage = ({data}) => {
        showMessage(data);
    }
    ws.onclose = () => {
        ws = null;
    }
    sendBtn.onclick = () => {
        if(messageBox.value === "")
            return
        if(!ws) {
            showMessage("No WebSocket connection :(");
            return;
        }
        ws.send(messageBox.value);
        showMessage(messageBox.value, true);
    }
}
init();