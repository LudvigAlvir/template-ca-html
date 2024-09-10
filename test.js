const data  = (
    await import ('./tests/rules.json' , {
        with : { type: 'json' }, 
    }
));
console.log(data);