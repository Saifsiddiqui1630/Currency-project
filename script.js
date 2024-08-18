const base_url ="https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_lz4VdjuG5f1DIQJOV3otbTnSIxTkmsKxO3OikwEp";

let currencyData = null; 
let btn = document.querySelector(".button");

let fromDropdown = document.querySelector(".from-box select");
let toDropdown = document.querySelector(".to-box select");

const fetchCurrencyData = async () => {
    try {
        const response = await fetch(base_url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Full Response:', data); // Log the full response
        if (data && data.data) {
            console.log('Currency Data:', data.data); // Log the data part
            currencyData = data; // Assign the fetched data
            initUI();
        } else {
            console.error('Unexpected response structure:', data);
        }
    } catch (error) {
        console.error('Error fetching currency data:', error);
    }
};




const initUI = () => {
    // Initialize the UI components here
    
    //console.log("Hello",currencyData);
    const dropdowns = document.querySelectorAll(".select-box select");
    let amt = document.querySelector(".amount");
    amt.value=1;
    dropdowns.forEach(dropdown => {
      for (const currCode in countryList) {
        let newOption = document.createElement('option');
        newOption.innerText = currCode;
        newOption.value = countryList[currCode];
  
        if (dropdown.name === "from" && currCode === "USD") {
          newOption.selected = "selected";
        } else if (dropdown.name === "to" && currCode === "INR") {
          newOption.selected = "selected";
        }
  
        dropdown.append(newOption);
      }
      dropdown.addEventListener("change", (evt) => {
        updateFlag(evt.target);
      });
    });
};

const updateFlag = (element)=>{
    const currCode = element.value;
    if(element.name === "from"){
        const img = document.querySelector(".flag1");
        img.src="https://flagsapi.com/"+currCode+"/flat/64.png";
    }
    else if(element.name === "to"){
        const img = document.querySelector(".flag2");
        img.src="https://flagsapi.com/"+currCode+"/flat/64.png";
    }
    // img.src="https://flagsapi.com/"+currCode+"/flat/64.png";
};


btn.addEventListener("click",(evt)=>{
    evt.preventDefault();
    let amt = document.querySelector(".amount");
    const amountValue = parseFloat(amt.value);

    const fromCountry = fromDropdown.value;
    const toCountry = toDropdown.value;

    const fromCurrency = Object.keys(countryList).find(key => countryList[key] === fromCountry);
    const toCurrency = Object.keys(countryList).find(key => countryList[key] === toCountry);
  
    // console.log(fromDropdown.value)
    if(amountValue === ""){
        amountValue=1;
        
    }
    if (isNaN(amountValue) || amountValue <= 0) {
        alert("Please enter a valid amount greater than 0");
        return;
    }

    if (!currencyData || !currencyData.data) {
        alert("Currency data is still loading or unavailable.");
        return;
    }
    let fromRate = currencyData.data[fromCurrency];
    let toRate = currencyData.data[toCurrency];
    // console.log(currencyData.data[toCurrency])
    const convertedAmount = (amountValue / fromRate) * toRate;
    //  console.log(toRate,fromRate, amountValue)
    document.querySelector(".result").textContent = `${amt.value} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`;
});


window.addEventListener('load', async () => {
    await fetchCurrencyData();
    console.log('Currency Data on Load:', currencyData);
    
});
