var initialProducts = [
    {
        "name": "Angle Protractor",
        "price": "8",
        "description": "General Tools 17 Square Head Stainless Steel Angle Protractor, 0 to 180 Degrees, 6-Inch Arm"
    },
    {
        "name": "Calculator",
        "price": "25",
        "description": "Texas Instruments TI-30Xa Scientific Calculator"
    },
    {
        "name": "Chalks",
        "price": "10",
        "description": "Crayola 1 Pack of 12, white"
    },
    {
        "name": "Pencil set",
        "price": "11",
        "description": "Mechanical pencils, medium point (0.7mm), 40-count, black"
    },
    {
        "name": "Eraser",
        "price": "5",
        "description": "Pentel Hi-Polymer Erasers, White, Pack of 4"
    },
    {
        "name": "Glue",
        "price": "12",
        "description": "Elmer's All-Purpose Glue Sticks, 12 count, 0.77-Ounces each"
    },
    {
        "name": "Scissors",
        "price": "6",
        "description": "Westcott 5'' Straight titanium bonded craft scissors with micro-tip"
    }
];

module.exports = {
    async up(db, client) {
        await db.collection('products').insertMany(initialProducts);
    },

    async down(db, client) {
        // TODO write the statements to rollback your migration (if possible)
        // Example:
        // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
    }
};