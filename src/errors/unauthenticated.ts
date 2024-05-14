import { StatusCodes } from "http-status-codes";
import CustomAPIError from "./custom-api";

class UnAuthenticatedError extends CustomAPIError{
    public statusCode;
    constructor(message:string){
        super(message)
        this.statusCode= StatusCodes.UNAUTHORIZED
    }
}

export default UnAuthenticatedError