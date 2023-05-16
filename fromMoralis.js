
const options = {
    method: 'GET',
    headers: { 'Accept': 'application/json', 'X-API-Key': process.env.X},
  };
  fetch('https://deep-index.moralis.io/api/v2/block/1000?chain=eth', options)
    .then((response) => response.json())
    .then((response) => printResult(response))
    .catch((err) => console.error(err))
  
  const printResult = (response) => {
    const container = document.getElementById('result')
    container.innerHTML = "<pre>" + JSON.stringify(response ,null, 2) + "</pre>"
  }