let server;
const request = require('supertest');
const { User } = require("../../models/user");

describe('auth middleware',()=>{

    beforeEach(()=>{server=require('../../index');});
    afterEach(async ()=>{
        await server.close();
        await User.remove({});
        });

    let token;
    let user
    const exec = ()=> {
        return request(server)
        .get('/api/users/me')
        .set('x-auth-token', token);
    }

    beforeEach(async ()=>{
        user = new User({
            name: 'ishan',
            email: 'ishan2198@hotmail.com',
            password: 'password' //unencrypted stored for test pupose only!!
        });
        await user.save()
        token = user.generateAuthToken(); 
    });
    
    it('should return 401 if no token is provided',async ()=>{
        token = '';

        const res = await exec();
        expect(res.status).toBe(401);
    });

    it('should return 400 if token is invalid',async ()=>{
        token = 'a';

        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return 200 if token is valid and contains user properties',async ()=>{

        const res = await exec();
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('name', user.name);
        expect(res.body).toHaveProperty('email', user.email);
    })
})