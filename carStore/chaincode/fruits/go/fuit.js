'use strict';
const shim = require('fabric-shim');
const util = require('util');


let Chaincode = class {
    async Init(stub) {
        console.info('Instantiated carstore chaincode');
        return shim.success();
    }
    async Invoke(stub) {
        let ret = stub.getFunctionAndParameters();
        console.info(ret);
        let method = this[ret.fcn];
        if (!method) {
            console.error('no function of name:' + ret.fcn + ' found');
            throw new Error('Received unknown function' + ret.fcn + 'invocation');
        }
        try {
            let payload = await method(stub, ret.params);
            return shim.success(payload);
        } catch (err) {
            console.log(err);
            return shim.error(err);
        }
    }
    async queryCar(stub, args) {
        if (args.length != 1) {
            throw new Error('Incorrect arg.')
        }
        let carNumber = args[0];
        let carAsBytes = await stub.getState(carNumber); //get the car from chaincode state 
        if (!carAsBytes || carAsBytes.toString().length <= 0) {
            throw new Error(carNumber + 'does not exist: ');
        }
        console.log(carAsBytes.toString());
        return carAsBytes;
    }
    async initLedger(stub, args) {
        console.info('START: Initialize Ledger ');
        let cars = [];
        cars.push({
            make: 'Toyota',
            model: 'Prius',
            color: 'blue',
            owner: 'Tomoko'
        });
        cars.push({
            make: 'Ford',
            model: 'Mustang',
            color: 'red',
            owner: 'Brad'
        });
        cars.push({
            make: 'Hyundai',
            model: 'Tucson',
            color: 'green',
            owner: 'Jin Soo'
        });
        cars.push({
            make: 'Volkswagen',
            model: 'Passat',
            color: 'Yellow',
            owner: 'Max'
        });
        cars.push({
            make: 'Tesla',
            model: 'S',
            color: 'Black',
            owner: 'Adriana'
        });
        cars.push({
            make: 'Peugot',
            model: '205',
            color: 'purple',
            owner: 'Don'
        });
        cars.push({
            make: 'Cherry',
            model: 'S2L',
            color: 'white',
            owner: 'Ajay'
        });
        cars.push({
            make: 'Fiat',
            model: 'Punto',
            color: 'grevioleten',
            owner: 'GG'
        });
        cars.push({
            make: 'Tata',
            model: 'Nano',
            color: 'Indigo',
            owner: 'Ayush'
        });
        cars.push({
            make: 'Holden',
            model: 'Barina',
            color: 'OOLllaaa',
            owner: 'Aurat'
        });

        for (let i = 0; i < cars.length; i++) {
            cars[i].docType = 'car';
            await stub.putState('CAR' + i, Buffer.from(JSON.stringify(cars[i])));
            console.info('Added <-> ', cars[i]);
        }
        console.info('= END : Initialize Ledger ===');
    }
    async createCar(stub, args) {
        console.info('= START: Create Car ===');
        if (args.length != 5) {
            throw new Error('Incorrect number of arguments. Expecting 5');
        }
        var car = {
            docType: 'car',
            make: args[1],
            model: args[2],
            color: args[3],
            owner: args[4]
        };
        await stub.putState(args[0], Buffer.from(JSON.stringify(car)));
        console.info('END: Create Car ');
    }
    // async queryAllCars(stub, args) {
    //     let startKey = "CARE';
    //     let endKey = 'CAR999';

    async queryAllCars(stub, args) {
        let startKey = 'CARO';
        let endKey = 'CAR999';
        let iterator = await stub.getStateByRange(startKey, endKey);
        let allResults = [];
        while (true) {
            let res = await iterator.next();
            if (res.value && res.value.value.toString()) {
                let jsonRes = 0;
                console.log(res.value.value.toString('utf8'));
                jsonRes.Key = res.value.key;
                try {
                    jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    jsonRes.Record = res.value.value.toString('utf8');
                }
                allResults.push(jsonRes);
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return Buffer.from(JSON.stringify(allResults));
            }
        }
    }
    // async changeCarOwner(stub, args) {
    //     console.info('START: changeCarOwner: ';
    //     if (args.length != 2) {

    async changeCarOwner(stub, args) {
        console.info(' START: changeCarOwner ');
        if (args.length != 2) {
            throw new Error('Incorrect number of arguments. Expecting 2');
        }
        let carAsBytes = await stub.getState(args[0]);
        let car = JSON.parse(carAsBytes);
        car.owner = args[1];
        await stub.putState(args[0], Buffer.from(JSON.stringify(car)));
        console.info('END: changeCarOwner ');
    }
}
shim.start(new Chaincode());