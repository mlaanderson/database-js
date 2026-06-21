import { ConnectionParams } from "./ConnectionParams.js";
import { Driver } from "./Driver.js";

export interface DriverMaker {

    open( params: ConnectionParams ): Driver;
}

