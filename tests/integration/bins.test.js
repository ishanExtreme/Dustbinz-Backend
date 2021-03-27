let server;
const {Bin} = require('../../models/bin');
const request = require('supertest');
const {User} = require('../../models/user');

describe('Bins route', ()=>{

    beforeEach(()=>{
        server=require('../../index');
    });

    afterEach(async ()=>{
        await Promise.all([server.close(), Bin.remove({}), User.remove({})]);
    });

    let token;
    let user;
    beforeEach(async ()=>{
        user = new User({
            name: 'ishan',
            email: 'ishan2198@hotmail.com',
            password: 'password' //unencrypted stored for test pupose only!!
        });
        await user.save();
        token = user.generateAuthToken();
    });

    const exec = (obj)=>{
        return request(server)
        .post('/api/bins')
        .send(obj)
        .set('x-auth-token', token);
    };

    it('Should return status 400 if name is not provided', async ()=>{
        const obj = {
            latitude: "200",
            longitude: "300",
            rating: "3"
        };
        const res = await exec(obj);
        expect(res.status).toBe(400);
    });

    it('Should return status 400 if latitude is not provided', async ()=>{
        const obj = {
            name: "dustbin-1",
            longitude: "300",
            rating: "3"
        };
        const res = await exec(obj);
        expect(res.status).toBe(400);
    });

    it('Should return status 400 if longitude is not provided', async ()=>{
        const obj = {
            name: "dustbin-1",
            latitude: "300",
            rating: "3"
        };
        const res = await exec(obj);
        expect(res.status).toBe(400);
    });

    it('Should return status 400 if rating is not provided', async ()=>{
        const obj = {
            name: "dustbin-1",
            longitude: "200",
            latitude: "300",
        };
        const res = await exec(obj);
        expect(res.status).toBe(400);
    });

    it('Should return status 200 if correct body is provided', async ()=>{
        const obj = {
            name: "dustbin-1",
            longitude: "200",
            latitude: "300",
            rating: "3"
        };
        const res = await exec(obj);
        expect(res.status).toBe(200);
    });

    it('It should contain reference to user', async ()=>{
        const obj = {
            name: "dustbin-1",
            longitude: "200",
            latitude: "300",
            rating: "3"
        };
        await exec(obj);
        const bin = await Bin.findOne({name: 'dustbin-1'}).populate('contributor');
        // console.log(bin);
        expect(bin.contributor.email).toBe("ishan2198@hotmail.com");
    });

    it('It should be in current user bin property', async ()=>{
        const obj = {
            name: "dustbin-1",
            longitude: "200",
            latitude: "300",
            rating: "3"
        };
        await exec(obj);
        const userObj = await User.findOne({email:"ishan2198@hotmail.com"}).populate("binsRef");
        const bin =  await Bin.findOne({name: 'dustbin-1'});
        expect(userObj.binsRef[0].name).toBe(obj.name);
        expect(userObj.binsProp[0].name).toBe(bin.name);
        expect(userObj.binsProp[0].isAccepted).toBe(bin.isAccepted);
    });


})