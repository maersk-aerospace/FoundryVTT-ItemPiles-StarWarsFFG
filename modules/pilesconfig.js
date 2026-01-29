// fully just referencing the itempiles provided example, the DnD5e version
// see https://github.com/fantasycalendar/FoundryVTT-ItemPilesDnD5e/blob/c8cde97962c5f1db4269a9a61cf9f4110b07381a/dist/module.js

Hooks.once("item-piles-ready", async () => {
    // we also use the deprecated itempiles swffg setting file as reference for our base configuration
    const baseConfig = {
        // type classes
        "ACTOR_CLASS_TYPE": "character", // maintains best similarity to what you expect to do the most of
        "ITEM_CLASS_LOOT_TYPE": "", // unnecessary
        "ITEM_CLASS_WEAPON_TYPE": "", // unnecessary
        "ITEM_CLASS_EQUIPMENT_TYPE": "", // unnecessary

        // core attribute paths
        "ITEM_QUANTITY_ATTRIBUTE": "system.quantity.value",
        "ITEM_PRICE_ATTRIBUTE": "system.price.value",

        // filters and similarities, filters out non-physical objects from piles and helps with stacking
        "ITEM_FILTERS": [{
            "path": "type",
            "filters": "species,career,specialization,ability,criticaldamage,criticalinjury,talent,homesteadupgrade,signatureability,forcepower"
        }],
        "ITEM_SIMILARITIES": ["name", "type"],

        // cash, duh
        "CURRENCIES": [
            {
                "type": "attribute",
                "name": "Credits",
                "img": "systems/starwarsffg/images/mod-all.png",
                "abbreviation": "{#}cr",
                "data": {
                    "path": "system.stats.credits.value"
                },
                "primary": true,
                "exchangeRate": 1,
                "index": 0,
                "id": "system.stats.credits.value"
            }
        ],

        // i have no idea how to make this work correctly, we're just shooting for the stars
        "ITEM_TYPE_HANDLERS": {
            "Transfer": {
                [game.itempiles.CONSTANTS.ITEM_TYPE_METHODS.CONTENTS]: ({ item }) => {
                    return item.data
                },
                [game.itempiles.CONSTANTS.ITEM_TYPE_METHODS.TRANSFER]: ({ item, items }) => {
                    items.push(item.data)
                }
            }
        },

        "ITEM_TRANSFORMER": async (itemData) => {
            if (itemData.type === "Transfer") {
                return itemData.data;
            }
            else {
                return itemData;
            }
        }
    }

    // define versions object, extends the base config
    // this lets us run over old configs with new versions
    // see https://fantasycomputer.works/FoundryVTT-ItemPiles/#/contributing-to-item-piles?id=adding-system-support
    const VERSIONS = {
        "1.906": {
            ...baseConfig,
            "VERSION": "0.0.4"
        }
    }

    // actually hook all the versions in now
    for (const [version, data] of Object.entries(VERSIONS)) {
        await game.itempiles.API.addSystemIntegration(data, version);
    }
});