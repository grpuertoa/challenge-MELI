//Require the file for testing
const apiHandler = require("../src/apiHandler");

//Testing for file reader
describe("API response tests", () => (
  beforeAll(() => {
    apiHandler.createHeader();
  }),

  test("Verify seller API for existing seller", async () => {
    let expectedResponse = {
      id: 41313508,
      nickname: "DP HIDRAULICA",
      country_id: "AR",
      address: {
        city: "Villa Crespo",
        state: "AR-C",
      },
      user_type: "normal",
      site_id: "MLA",
      permalink: "http://perfil.mercadolibre.com.ar/DP+HIDRAULICA",
      seller_reputation: {
        level_id: "5_green",
        power_seller_status: "platinum",
        transactions: {
          period: "historic",
          total: 32081,
        },
      },
      status: {
        site_status: "active",
      },
    };
    let response = await apiHandler.sellerAPI(
      "41313508",
      apiHandler.getHeader()
    );
    expect(response).toEqual(expectedResponse);
  }),

  test("Verify category API for existing category", async () => {
    let expectedResponse = {
      id: "MLA447221",
      name: "Kits de Dirección Hidráulica",
      picture: null,
      permalink: null,
      total_items_in_this_category: 183,
      path_from_root: [
        { id: "MLA5725", name: "Accesorios para Vehículos" },
        { id: "MLA1747", name: "Repuestos Autos y Camionetas" },
        { id: "MLA22222", name: "Suspensión y Dirección" },
        { id: "MLA447221", name: "Kits de Dirección Hidráulica" },
      ],
      children_categories: [],
      attribute_types: "attributes",
      settings: {
        adult_content: false,
        buying_allowed: true,
        buying_modes: ["auction", "buy_it_now"],
        catalog_domain: "MLA-LIGHT_VEHICLE_PARTS",
        coverage_areas: "not_allowed",
        currencies: ["ARS"],
        fragile: false,
        immediate_payment: "required",
        item_conditions: ["new"],
        items_reviews_allowed: false,
        listing_allowed: true,
        max_description_length: 50000,
        max_pictures_per_item: 12,
        max_pictures_per_item_var: 10,
        max_sub_title_length: 70,
        max_title_length: 60,
        max_variations_allowed: 100,
        maximum_price: null,
        maximum_price_currency: "ARS",
        minimum_price: 750,
        minimum_price_currency: "ARS",
        mirror_category: null,
        mirror_master_category: null,
        mirror_slave_categories: [],
        price: "required",
        reservation_allowed: "not_allowed",
        restrictions: [],
        rounded_address: false,
        seller_contact: "not_allowed",
        shipping_options: ["carrier", "custom"],
        shipping_profile: "optional",
        show_contact_information: false,
        simple_shipping: "optional",
        stock: "required",
        sub_vertical: "car_suspension_steering",
        subscribable: false,
        tags: [],
        vertical: "vehicle_parts_accessories",
        vip_subdomain: "articulo",
        buyer_protection_programs: ["delivered", "undelivered"],
        status: "enabled",
      },
      channels_settings: [
        { channel: "mshops", settings: { minimum_price: 0 } },
        { channel: "proximity", settings: { status: "disabled" } },
        {
          channel: "mp-merchants",
          settings: {
            buying_modes: ["buy_it_now"],
            immediate_payment: "required",
            minimum_price: 1,
            status: "enabled",
          },
        },
        {
          channel: "mp-link",
          settings: {
            buying_modes: ["buy_it_now"],
            immediate_payment: "required",
            minimum_price: 1,
            status: "enabled",
          },
        },
      ],
      meta_categ_id: null,
      attributable: false,
      date_created: "2020-07-17T12:08:33.074Z",
    };
    let response = await apiHandler.categoryAPI(
      "MLA447221",
      apiHandler.getHeader()
    );
    expect(response).toEqual(expectedResponse);
  }),

  test("Verify currency API for existing currency", async () => {
    let expectedResponse = {
      id: "ARS",
      symbol: "$",
      description: "Peso argentino",
      decimal_places: 2,
    };
    let response = await apiHandler.currencyAPI("ARS", apiHandler.getHeader());
    expect(response).toEqual(expectedResponse);
  }),

  test("Verify seller API for not existing seller", async () => {
    try {
      let response = await apiHandler.sellerAPI("4pl9", apiHandler.getHeader());
    } catch (error) {
      expect(error.message).toBe("Request failed with status code 404");
    }
  }),

  test("Verify category API for undefined value at category_id", async () => {
    try {
      let response = await apiHandler.sellerAPI(undefined, apiHandler.getHeader());
    } catch (error) {
      expect(error.message).toBe("Request failed with status code 404");
    }
  })
));
