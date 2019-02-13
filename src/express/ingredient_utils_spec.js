const assert = require('assert');
const ingredient_utils = require('./ingredient_utils.js');
const database = require('./database.js');

describe('loading express', function () {
    beforeEach(function (done) {
        database.dropDatabase().then(response => {
            console.log("Database dropped: ", response);
            done();
        });
    });
    afterEach(function (done) {
        database.dropDatabase().then(response => {
            console.log("Database dropped: ", response);
            done();
        });
    });

    it('creates ingredient with all fields', function (done) {
        ingredient_utils.createIngredient("salt", 123, "farms", "oz", 12, 20, "comment!").then(response => {
            assert.equal(response['ingredientname'], "salt");
            assert.equal(response['ingredientnumber'], 123);
            assert.equal(response['vendorinformation'], "farms");
            assert.equal(response['unit of measure'], "oz");
            assert.equal(response['amount'], 12)
            assert.equal(response['costperpackage'], 20);
            assert.equal(response['comment'], "comment!");
            done();
        }).catch(err => {
            assert.fail(err);
        });
    });

    it('creates ingredient with no user specified number', function (done) {
        ingredient_utils.createIngredient("salt2", null, "farms", "oz", 12, 20, "comment!").then(response => {
            assert.equal(response['ingredientname'], "salt2");
            assert.notEqual(response['ingredientnumber'], null);
            assert.equal(response['vendorinformation'], "farms");
            assert.equal(response['unitofmeasure'], "oz");
            assert.equal(response['amount'], 12);
            assert.equal(response['costperpackage'], 20);
            assert.equal(response['comment'], "comment!");
            done();
        }).catch(err => {
            assert.fail(err);
        });
    });

    // it('modifies and then fetches an ingredient', function (done) {
    //     ingredient_utils.modifyIngredient("salt2", "corn", 345, "corn farm", "12oz", 20, "N/A").then(response => {
    //         console.log("modify response", response)
    //         ingredient_utils.getIngredients("corn", null, null, 1).then(ingredients => {
    
    //             console.log("ingredients",ingredients)
    //             assert.equal(ingredients['ingredientname'], "corn");
    //             assert.equal(ingredients['ingredientnumber'], 61554316);
    //             assert.equal(ingredients['vendorinformation'], "corn farm");
    //             assert.equal(ingredients['packagesize'], "12oz");
    //             assert.equal(ingredients['costperpackage'], 20);
    //             assert.equal(ingredients['comment'], "N/A");
    //             done();
    //         }).catch(err => {
    //             assert.fail(Error(err));
    //         })
    //     }).catch(err => {
    //         assert.fail(Error(err));
    //     });
    // });

    // it('deletes an ingredient', function (done) {
    //     ingredient_utils.deleteIngredient("corn").then(response => {
    //         console.log(response)
    //         ingredient_utils.getIngredients("", null, null, null).then(ingredients => {

    //             assert.equal(ingredients.length, 0);
    //             done();
    //         }).catch(err => {
    //             assert.fail(err);
    //             done
    //         });
    //     }).catch(err => {
    //         assert.fail(err);
    //     });
        
    //     // ingredient_utils.getIngredients("", null, null, null).then(ingredients => {

    //     //     assert.equal(ingredients.length, 0);
    //     //     done();
    //     // }).catch(err => {
    //     //     assert.fail(err);
    //     //     done
    //     // });
    // });

});