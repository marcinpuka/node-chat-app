var expect = require("expect");
var {generateMessage, generateLocationMessage} = require("./message");

describe("generateMessage", () => {
    it("should generate message object", () => {
        var from = "Alien"; 
        var text = "The truth is out there";
            
        var result = generateMessage(from,  text);
        
        expect(result.createdAt).toBeA("number");
        expect(result).toInclude({
            from, 
            text
        });    
    });
});

describe("generateLocationMessage", () => {
   it("should generate correct location object", () => {
      var from = "Deb";
      var latitude = 15;
      var longitude = 19;
      var url = "https://www.google.com/maps?q=15,19";
       
      var message = generateLocationMessage(from, latitude, longitude);   
      
      expect(message.createdAt).toBeA("number");
      expect(message).toInclude({from, url});
      
   });
});