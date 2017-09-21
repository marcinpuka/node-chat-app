var expect = require("expect");
var {generateMessage} = require("./message");

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