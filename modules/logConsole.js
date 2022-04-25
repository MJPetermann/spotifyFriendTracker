import dayjs from 'dayjs';
export function cLog(message){
    console.log("["+dayjs().format("YYMMDD-HHmmss")+"] "+message)
}