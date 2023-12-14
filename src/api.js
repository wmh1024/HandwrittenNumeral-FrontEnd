import axios from 'axios'

export const getInfoApi = () => {
    return axios.get('http://127.0.0.1:5000/info')
}

export const getStatusApi = () => {
    return axios.get('http://127.0.0.1:5000/status')
}

export const beginApi = () => {
    return axios.get('http://127.0.0.1:5000/begin')
}

export const resetApi = () => {
    return axios.get('http://127.0.0.1:5000/reset')
}
