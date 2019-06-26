var faker = require('faker');
var mongoose = require("mongoose");
var User = require("./models/user");
var Video = require("./models/video");
var Download = require("./models/download");



async function seedDB() {
    User.deleteMany({isFaculty: true});
	for(const i of new Array(25)) {
		const firstName =  faker.name.firstName();
		const lastName =  faker.name.lastName();
		const username =  faker.internet.userName();
		const image =  faker.image.avatar();
		const description = faker.lorem.text();
		const location = faker.lorem.word();
		const address = faker.address.streetAddress();
		const city = faker.address.city();
		const state = faker.address.state();
		const country = faker.address.country();
		const mobile = faker.phone.phoneNumber();
		const email = faker.internet.email();
		const subject = ["P4 Strategic Financial Management","P7 Direct Tax"];
		const videos=["5d0a6990a4afc8243bd43691", "5d0b5b138aa66c1bbd4f39de"];    
		const downloads=["5d0a8ae5247eec2cc7ba07ac", "5d0a8ae5247eec2cc7ba07ac"];
		const isFaculty = true;
		const userData = {
			firstName,lastName, username, image, description, location, address, city, state, country, mobile, email, subject, videos, downloads, isFaculty
		};
		let user = new User(userData);
		user.save();
	}
	console.log('600 new posts created');
}


// var seeds = [
//     {
//         username: "harry",
//         firstName: "Harry",
//         lastName:"Potter",
//         image: "https://img.buzzfeed.com/buzzfeed-static/static/2015-11/19/17/enhanced/webdr02/original-grid-image-23059-1447970713-6.jpg?downsize=700:*&output-format=auto&output-quality=auto",
//         description: "Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah",
//         location: "Mumbai",
//         subject: "P4 Strategic Financial Management",
//         email: "harry@hogwarts.com",
//         resource: "10 Files"
   
//     },
//     {
//         username: "ron",
//         firstName: "Ron",
//         lastName:"Weasley",
//         image: "https://upload.wikimedia.org/wikipedia/en/thumb/5/5e/Ron_Weasley_poster.jpg/220px-Ron_Weasley_poster.jpg",
//         description: "Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah",
//         location: "Delhi",
//         subject: "P7 Direct Tax",
//         email: "ron@hogwarts.com",
//         resource: "15 Files"    
//     },
//     {
//         username: "hermione",
//         firstName: "Hermione",
//         lastName:"Granger",
//         image: "https://vignette.wikia.nocookie.net/characters/images/a/a5/Latest_%2810%29.jpg/revision/latest?cb=20141230074301",
//         description: "Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah",
//         location: "Mumbai",
//         subject: "P8 Indirect Tax",
//         email: "hermione@hogwarts.com",
//         resource: "12 Files"        
        
//     }
// ];

// async function seedDB(){
//     try {
//         await User.deleteMany({});
//         console.log('User removed');
//         for(const seed of seeds) {
//             let user = await User.create(seed);
//             console.log('User created');
//             user.save();
//         }
//     } catch(err) {
//         console.log(err);
//     }
// }

module.exports = seedDB;