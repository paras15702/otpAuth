import { initializeApp } from "firebase/app";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import {getDatabase} from "firebase/database";
import {ref,set} from "firebase/database";
import {useState} from "react";


const firebaseConfig = {
  apiKey: "AIzaSyAAsaQjn94oBdiT6Ta1YHsTqrYFCARUnG8",
  authDomain: "otpapp14july23-cb2c9.firebaseapp.com",
  databaseURL: "https://otpapp14july23-cb2c9-default-rtdb.firebaseio.com",
  projectId: "otpapp14july23-cb2c9",
  storageBucket: "otpapp14july23-cb2c9.appspot.com",
  messagingSenderId: "1001876061952",
  appId: "1:1001876061952:web:8053690d32c9024b16bde5"
};


const app = firebase.initializeApp(firebaseConfig);
const db=getDatabase(app);

export default function Enquiry()
{
	const[name,setName]=useState("");
	const[query,setQuery]=useState("");
	const[phone,setPhone]=useState("");
	const[otp,setOtp]=useState("");
	const[final,setFinal] = useState("")


	const configureCaptcha=()=>{
		
		window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button',{
		'size':'invisible',
		'callback':(response)=>{
			sendOtp();
			console.log("Recaptcha Verified");
		},
		defaultCountry:"IN"
		});
	}

	const sendOtp = (event) => {
			
			event.preventDefault();
			configureCaptcha();
			let pn="+91"+phone;
			let av=window.recaptchaVerifier;
			firebase.auth().signInWithPhoneNumber(pn,av)
			.then(res => {
					setFinal(res);
					console.log(res);
					console.log("OTP SENT");
					alert("OTP SENT");
			})
			.catch(err => {
					console.log(err);
			})
	}


	const submitOtp = (event) => {
			
			event.preventDefault();
			final.confirm(otp)
			.then(res => {
				const d = new Date().toString();
				const n = name+"-->"+d;
				const data = {name,phone,query,d};
				set(ref(db,"visitors/"+n),data)
				.then(res => {
						console.log(res);
						alert("we will contact u soon");
						window.location.reload();
				})
				.catch(err => {
						console.log(err);
						
				})
			})
			
			.catch(err => {
						console.log(err);
						alert("INVALID OTP");
						window.location.reload();
				})
	}
	



	return(
		<>
			<center>
				<h1> Fill the Form</h1>
				<form onSubmit={sendOtp}>
					<div id="sign-in-button"></div>
					<input type="text" placeholder="enter ur name" onChange={(event)=>{setName(event.target.value);}}/>
					<br/><br/>
					<textarea placeholder="enter query" rows={5} cols ={30} onChange={(event)=>{setQuery(event.target.value);}}></textarea>
					<br/><br/>
					<input type="number" placeholder="enter phone" onChange={(event)=>{setPhone(event.target.value);}}/>
					<br/><br/>
					<input type="submit" value="GENERATE OTP"/>
				</form>
				<form onSubmit={submitOtp}>
					<input type="number" placeholder="enter OTP" onChange={(event)=>{setOtp(event.target.value);}}/>
					<br/><br/>
					<input type="submit" value="SUBMIT OTP"/>
				</form>
			</center>
		</>
		);
}
