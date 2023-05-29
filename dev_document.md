// .htaccess file locate when deploy
  ./.htaccess
  ./portal/.htaccess

// Change database config
backend/config/database.php
  // specify your own database credentials
  define('DB_HOST', '31.11.39.32'); -> localhost
  define('DB_USER', 'Sql1513497'); -> root
  define('DB_PASS', 'z8lb8r0070'); -> ''
  define('DB_NAME', 'Sql1513497_1'); -> ==

  // Remove argument mysqli_connect_errno($connect)
  // backend/co

// Change database table config "resources"
  width, height, deep, weight -> Length 6

//app.config.ts
  //prod
  /*apiEndpoint: 'https://rent.altervista.org/api/',
  urlImages: '/images'*/
  //test
  apiEndpoint: 'http://localhost/api/',
  urlImages: 'http://localhost/images',
  domain : 'localhost',
  //product
  /*apiEndpoint: 'https://www.gestirefacile.it/api/',
  urlImages: 'https://www.gestirefacile.it/images',
  domain : 'gestirefacile.it',*/

// environment.ts
  production: true

// app build
  ng build


// portal/index.html
  <base href="/"> -> <base href="/portal/">




//=====================================================================================//
//===========================Should be more changeable serverDone===================//
//=====================================================================================//

// Should change database for Payment of event========done
  - regarding the event payment in frontend
  - payments table -> add fields "paymentDate", "paymentNote"
  - backend/api/events/update.php line 159 also insert.php

// Sould change database for adding "iban", "pec" in Supplier(vendor)====done
  - regarding to add "iban", "pec" in supplier detail
  - venders table -> add fields "iban", "pec"
  - backend/api/venders/update.php line 24 also insert.php

// Should change database for adding "photo" in package ======done 
  - regarding to add "photo" in package
  - packages table -> add field "image"
  - backend/api/package/insert.php and update.php
  - confirm image holder : root/images/packages




///////////////////////////////////////////////////////////////////////////////////////////////////

//=====================================================================================//
//=========================== eventurl ===================//
//=====================================================================================//

1. event attach file upload=========================================done
  - events table -> insert feild `attach_file` varchar 512

2. resource_resources_assoc -> =====================================done
  - add fields: 
    address varchar 255
    refNumber varchar 20
  
3. resource_types -> add data ========================================done
  - Noleggio    Noleggio con Operatore
  - Servizio    Servizio
  - Vendita     Vendita


//========================================== new =======================================//
4. table `resources` -> add feild =================================done
  -  servicePropertyNote   Longtext
  - is_trash int default=0 Not Null
5. table `resource_resource_assoc =============================== done
  - change foreign key `FK_RES_ASSOC_OID` -> On Delete =  CASCADE
6. table `events` -> add field ===================================done
  - is_trash int default=0 Not Null



//======================= 05/08/2023 ===========================================//
1. table `customers` add feild ================================ done
  - oid_customer_by_user  int  11  Notnull

2. remove the value `service` and `Noleggio con Operatore` in table `resource_types` =======done

3. table `resources` add field ===================================done
  - `address` varchar 255 

4. Add data into table `roles` ============================done
 - 5   Entertrainer     Entertrainer

5. create new table `entertrainer_availabilities` ================done
  - oid     int    11   Notnull     primary
  - entertrainer_oid    int    11   Notnull
  - business_oid      int      11 
  - title varchar 100
  - start_date  datetime
  - end_date   datetime
  - all_day   int 11
  - location   varchar 100
  - note    text 
  - primary_color   varchar 50
  - secondary_color varchar 50
  - created_ts