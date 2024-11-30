class Rent {
    constructor(idVehicle, idClient, startDate, returnDate, returned){
        this.id = Date.now() + Math.random().toString(36).substring(4, 11);
        this.idVehicle = idVehicle;
        this.idClient = idClient;
        this.startDate = startDate;
        this.returnDate = returnDate;
        this.returned = false;
    }
}




