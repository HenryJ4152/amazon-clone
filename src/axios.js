import axios from 'axios'

const instance = axios.create({
    baseURL: 'https://us-central1-challenge-e4db3.cloudfunctions.net/api'

    // 'http://localhost:5001/challenge-e4db3/us-central1/api' 
    //the api (cloud fxns) url
})

export default instance



// signed up for blaze but firebase deploy--only functions in our functions folder not working