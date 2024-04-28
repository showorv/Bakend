class Errorhandle extends Error{
    constructor(
        statuscode,
        message="Something went wrong",
        error=[],
        stack=""
    ){
        //override

        super(message)
        this.statuscode=statuscode
        this.data=null
        this.success=false
        this.error=error;

        if(stack){
            this.stack=stack;
        }
        else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export{Errorhandle};