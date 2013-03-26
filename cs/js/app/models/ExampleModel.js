define([
    'sys/ValidationModel'
],function(
    ValidationModel
){
    
    // todo: implement me!
    var ExampleModel = ValidationModel.extend({
        
        // see https://github.com/thedersen/backbone.validation#example
        validation: {
            name: {
                required: true
            },
            'address.street': {
                required: true
            },
            'address.zip': {
                length: 4
            },
            age: {
                range: [1, 80]
            },
            email: [
                {
                    required: true
                  , msg: 'Please enter an email address'
                }
              , {
                    pattern: 'email'
                  , msg: 'Please enter a valid email'
                }
            ]
          , someAttribute: function(value) {
                if(value !== 'somevalue') {
                    return 'Error message';
                }
            }
        }

    });
    
    return ExampleModel;
});