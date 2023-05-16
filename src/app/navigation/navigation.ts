import { FuseNavigation } from '@fuse/types';

export const navigationSuper: FuseNavigation[] = [
    {
        id       : 'applications',
        title    : 'Applications',
        translate: 'NAV.APPLICATIONS',
        type     : 'group',
        children : [
            {
                id       : 'dashboard',
                title    : 'Dashboard',
                translate: 'NAV.DASHBOARD.TITLE',
                type     : 'item',
                icon     : 'dashboard',
                url      : '/dashboard'/*,
                badge    : {
                    title    : '25',
                    translate: 'NAV.DASHBOARD.BADGE',
                    bg       : '#F44336',
                    fg       : '#FFFFFF'
                }*/
            },
            {
                id       : 'usermanger',
                title    : 'Gestione Utenti',
                translate: 'NAV.USERMANAGER.TITLE',
                type     : 'item',
                icon     : 'people',
                url      : '/usermanager'/*,
                badge    : {
                    title    : '25',
                    translate: 'NAV.DASHBOARD.BADGE',
                    bg       : '#F44336',
                    fg       : '#FFFFFF'
                }*/
            },
            {
                id       : 'businesses',
                title    : 'Gestione Attività',
                translate: 'NAV.BUSINESSES.TITLE',
                type     : 'item',
                icon     : 'business',
                url      : '/businessesmanager'/*,
                badge    : {
                    title    : '25',
                    translate: 'NAV.DASHBOARD.BADGE',
                    bg       : '#F44336',
                    fg       : '#FFFFFF'
                }*/
            },
            {
                id       : 'roles',
                title    : 'Gestione Ruoli',
                translate: 'NAV.ROLES.TITLE',
                type     : 'item',
                icon     : 'verified_user',
                url      : '/rolemanager'/*,
                badge    : {
                    title    : '25',
                    translate: 'NAV.DASHBOARD.BADGE',
                    bg       : '#F44336',
                    fg       : '#FFFFFF'
                }*/
            },
            {
                id       : 'push',
                title    : 'Invio Messaggi',
                translate: 'NAV.PUSH.TITLE',
                type     : 'item',
                icon     : 'messages',
                url      : '/messagemanager'/*,
                badge    : {
                    title    : '25',
                    translate: 'NAV.DASHBOARD.BADGE',
                    bg       : '#F44336',
                    fg       : '#FFFFFF'
                }*/
            },
            {
                id       : 'access',
                title    : 'Controllo Accessi',
                translate: 'NAV.LOG.TITLE',
                type     : 'item',
                icon     : 'security',
                url      : '/accesses'/*,
                badge    : {
                    title    : '25',
                    translate: 'NAV.DASHBOARD.BADGE',
                    bg       : '#F44336',
                    fg       : '#FFFFFF'
                }*/
            }
            ,
            {
                id       : 'plans',
                title    : 'Piani',
                translate: 'NAV.PLAN.TITLE',
                type     : 'item',
                icon     : 'dns',
                url      : '/plansmanager'/*,
                badge    : {
                    title    : '25',
                    translate: 'NAV.DASHBOARD.BADGE',
                    bg       : '#F44336',
                    fg       : '#FFFFFF'
                }*/
            }
        ]
    }
];

// this is Resourcer role
export const navigation: FuseNavigation[] = [
    // {
    //     id       : 'applications',
    //     title    : 'Applications',
    //     translate: 'NAV.APPLICATIONS',
    //     type     : 'group',
    //     children : [
    //         {
    //             id       : 'dashboard',
    //             title    : 'Dashboard',
    //             translate: 'NAV.DASHBOARD.TITLE',
    //             type     : 'item',
    //             icon     : 'dashboard',
    //             url      : '/dashboard',
    //             badge    : {
    //                 title    : '25',
    //                 translate: 'NAV.DASHBOARD.BADGE',
    //                 bg       : '#F44336',
    //                 fg       : '#FFFFFF'
    //             }
    //         }
    //     ]
    // }
    {
      id       : 'applications',
      title    : 'Applicazioni',
      translate: 'NAV.APPLICATIONS',
      type     : 'group',
      children : [
          {
              id       : 'home',
              title    : 'Home',
              translate: 'NAV.DASHBOARD.TITLE',
              type     : 'item',
              icon     : 'home',
              url      : '/home'/*,
              badge    : {
                  title    : '25',
                  translate: 'NAV.DASHBOARD.BADGE',
                  bg       : '#F44336',
                  fg       : '#FFFFFF'
              }*/
          },
          {
              id       : 'calendars',
              title    : 'Calendari',
              translate: 'NAV.CALENDARS.TITLE',
              type     : 'collapsable',
              icon     : 'calendar_today',
              children : [
                  {
                      id   : 'calendar_events',
                      translate: 'NAV.EVENTS_RESOURCE.TITLE',
                      title: 'Eventi e Risorse',
                      type : 'item',
                      icon     : 'today',
                      url      : '/dashboard'
                  }
              ]
          },
          {
              id       : 'events',
              title    : 'Eventi',
              translate: 'NAV.EVENTS.TITLE',
              type     : 'item',
              icon     : 'event',
              url      : '/eventsmanager'/*,
              badge    : {
                  title    : '25',
                  translate: 'NAV.DASHBOARD.BADGE',
                  bg       : '#F44336',
                  fg       : '#FFFFFF'
              }*/
          },
          {
              id       : 'todo',
              title    : 'To Do List',
              translate: 'NAV.TODO.TITLE',
              type     : 'item',
              icon     : 'list',
              url      : '/todolistmanager'/*,
              badge    : {
                  title    : '25',
                  translate: 'NAV.DASHBOARD.BADGE',
                  bg       : '#F44336',
                  fg       : '#FFFFFF'
              }*/
          },
          {
              id       : 'todo',
              title    : 'Appuntamenti',
              translate: 'NAV.APPOINTMENT.TITLE',
              type     : 'item',
              icon     : 'contact_phone',
              url      : '/appointments'/*,
              badge    : {
                  title    : '25',
                  translate: 'NAV.DASHBOARD.BADGE',
                  bg       : '#F44336',
                  fg       : '#FFFFFF'
              }*/
          },
          // {
          //     id       : 'firstnote',
          //     title    : 'Prima nota',
          //     translate: 'NAV.FIRST_NOTE.TITLE',
          //     type     : 'item',
          //     icon     : 'iso',
          //     url      : '/firstnote'/*,
          //     badge    : {
          //         title    : '25',
          //         translate: 'NAV.DASHBOARD.BADGE',
          //         bg       : '#F44336',
          //         fg       : '#FFFFFF'
          //     }*/
          // },
          {
              id       : 'warehouse',
              title    : 'Movimenti di Magazzino',
              translate: 'NAV.MOVEMENTS.TITLE',
              type     : 'item',
              icon     : 'store',
              url      : '/movements'/*,
              badge    : {
                  title    : '25',
                  translate: 'NAV.DASHBOARD.BADGE',
                  bg       : '#F44336',
                  fg       : '#FFFFFF'
              }*/
          },
          // {
          //     id       : 'access',
          //     title    : 'Controllo Accessi',
          //     translate: 'NAV.LOG.TITLE',
          //     type     : 'item',
          //     icon     : 'security',
          //     url      : '/myaccesses'/*,
          //     badge    : {
          //         title    : '25',
          //         translate: 'NAV.DASHBOARD.BADGE',
          //         bg       : '#F44336',
          //         fg       : '#FFFFFF'
          //     }*/
          // },
          {
              id       : 'configurations',
              title    : 'Configurazioni',
              translate : 'NAV.CONFIG.TITLE',
              type     : 'collapsable',
              icon     : 'settings',
              children : [
                  {
                      id        : 'categories',
                      title     : 'Gestione Categorie',
                      translate : 'NAV.CATEGORIES.TITLE',
                      type      : 'item',
                      icon      : 'category',
                      url       : '/categoriesmanager',
                      exactMatch: true
                  },
                  {
                      id        : 'skills',
                      title     : 'Gestione Mansioni',
                      translate : 'NAV.SKILLS.TITLE',
                      type      : 'item',
                      icon      : 'power',
                      url       : '/skillsmanager',
                      exactMatch: true
                  },
                  {
                      id        : 'resources',
                      title     : 'Gestione Risorse',
                      translate : 'NAV.RESOURCES.TITLE',
                      type      : 'item',
                      icon      : 'group_work',
                      url       : '/resourcesmanager',
                      exactMatch: true
                  },
                  {
                      id        : 'customers',
                      title     : 'Gestione Clienti',
                      translate : 'NAV.CUSTOMERS.TITLE',
                      type      : 'item',
                      icon      : 'groups',
                      url       : '/customersmanager',
                      exactMatch: true
                  },
                  {
                      id        : 'vendors',
                      title     : 'Gestione Fornitori',
                      translate : 'NAV.VENDORS.TITLE',
                      type      : 'item',
                      icon      : 'business_center',
                      url       : '/vendorsmanager',
                      exactMatch: true
                  },
                  {
                      id        : 'eventtypes',
                      title     : 'Tipi di Evento',
                      translate : 'NAV.EVENTTYPES.TITLE',
                      type      : 'item',
                      icon      : 'event_note',
                      url       : '/eventtypesmanager',
                      exactMatch: true
                  },
                  {
                      id        : 'circles',
                      title     : 'Cerchie',
                      translate : 'NAV.CIRCLES.TITLE',
                      type      : 'item',
                      icon      : 'supervised_user_circle',
                      url       : '/circlesmanager',
                      exactMatch: true
                  },
                  {
                      id        : 'myusers',
                      title     : 'I miei utenti',
                      translate : 'NAV.MYUSERS.TITLE',
                      type      : 'item',
                      icon      : 'people',
                      url       : '/myusermanager',
                      exactMatch: true
                  },
                  {
                      id       : 'warehouse',
                      title    : 'Magazzino',
                      translate: 'NAV.WAREHOUSE.TITLE',
                      type     : 'item',
                      icon     : 'store',
                      url      : '/warehousemanager'/*,
                      badge    : {
                          title    : '25',
                          translate: 'NAV.DASHBOARD.BADGE',
                          bg       : '#F44336',
                          fg       : '#FFFFFF'
                      }*/
                  },
                  {
                      id       : 'business',
                      title    : 'Le mie Attività',
                      translate: 'NAV.MYBUSINESS.TITLE',
                      type     : 'item',
                      icon     : 'business',
                      url      : '/mybusiness'/*,
                      badge    : {
                          title    : '25',
                          translate: 'NAV.DASHBOARD.BADGE',
                          bg       : '#F44336',
                          fg       : '#FFFFFF'
                      }*/
                  },
                  {
                      id       : 'package',
                      title    : 'Gestione Pacchetti',
                      translate: 'NAV.PACKAGE.TITLE',
                      type     : 'item',
                      icon     : 'playlist_add',
                      url      : '/packagesmanager'/*,
                      badge    : {
                          title    : '25',
                          translate: 'NAV.DASHBOARD.BADGE',
                          bg       : '#F44336',
                          fg       : '#FFFFFF'
                      }*/
                  },
                  // {
                  //     id       : 'firstnoteconf',
                  //     title    : 'Prima Nota',
                  //     translate : 'NAV.FIRST_NOTE_CONF.TITLE',
                  //     type     : 'collapsable',
                  //     icon     : 'note',
                  //     children : [{
                  //         id        : 'accounts',
                  //         title     : 'Configurazione Conti',
                  //         translate : 'NAV.ACCOUNTS_CONF.TITLE',
                  //         type      : 'item',
                  //         icon      : 'notes',
                  //         url       : '/accountsmanager',
                  //         exactMatch: true
                  //     },
                  //     {
                  //         id        : 'firstnotecategory',
                  //         title     : 'Configurazione Categorie',
                  //         translate : 'NAV.FN_CATEGORI.TITLE',
                  //         type      : 'item',
                  //         icon      : 'category',
                  //         url       : '/fncategoriesmanager',
                  //         exactMatch: true
                  //     }]
                  // }
              ]
          },

      ]
  }
];


export const navigationManager: FuseNavigation[] = [
    {
        id       : 'applications',
        title    : 'Applicazioni',
        translate: 'NAV.APPLICATIONS',
        type     : 'group',
        children : [
            {
                id       : 'home',
                title    : 'Home',
                translate: 'NAV.DASHBOARD.TITLE',
                type     : 'item',
                icon     : 'home',
                url      : '/home'/*,
                badge    : {
                    title    : '25',
                    translate: 'NAV.DASHBOARD.BADGE',
                    bg       : '#F44336',
                    fg       : '#FFFFFF'
                }*/
            },
            {
                id       : 'calendars',
                title    : 'Calendari',
                translate: 'NAV.CALENDARS.TITLE',
                type     : 'collapsable',
                icon     : 'calendar_today',
                children : [
                    {
                        id   : 'calendar_events',
                        translate: 'NAV.EVENTS_RESOURCE.TITLE',
                        title: 'Eventi e Risorse',
                        type : 'item',
                        icon     : 'today',
                        url      : '/dashboard'
                    }
                ]
            },
            {
                id       : 'events',
                title    : 'Eventi',
                translate: 'NAV.EVENTS.TITLE',
                type     : 'item',
                icon     : 'event',
                url      : '/eventsmanager'/*,
                badge    : {
                    title    : '25',
                    translate: 'NAV.DASHBOARD.BADGE',
                    bg       : '#F44336',
                    fg       : '#FFFFFF'
                }*/
            },
            {
                id       : 'todo',
                title    : 'To Do List',
                translate: 'NAV.TODO.TITLE',
                type     : 'item',
                icon     : 'list',
                url      : '/todolistmanager'/*,
                badge    : {
                    title    : '25',
                    translate: 'NAV.DASHBOARD.BADGE',
                    bg       : '#F44336',
                    fg       : '#FFFFFF'
                }*/
            },
            {
                id       : 'todo',
                title    : 'Appuntamenti',
                translate: 'NAV.APPOINTMENT.TITLE',
                type     : 'item',
                icon     : 'contact_phone',
                url      : '/appointments'/*,
                badge    : {
                    title    : '25',
                    translate: 'NAV.DASHBOARD.BADGE',
                    bg       : '#F44336',
                    fg       : '#FFFFFF'
                }*/
            },
            {
                id       : 'firstnote',
                title    : 'Prima nota',
                translate: 'NAV.FIRST_NOTE.TITLE',
                type     : 'item',
                icon     : 'iso',
                url      : '/firstnote'/*,
                badge    : {
                    title    : '25',
                    translate: 'NAV.DASHBOARD.BADGE',
                    bg       : '#F44336',
                    fg       : '#FFFFFF'
                }*/
            },
            {
                id       : 'warehouse',
                title    : 'Movimenti di Magazzino',
                translate: 'NAV.MOVEMENTS.TITLE',
                type     : 'item',
                icon     : 'store',
                url      : '/movements'/*,
                badge    : {
                    title    : '25',
                    translate: 'NAV.DASHBOARD.BADGE',
                    bg       : '#F44336',
                    fg       : '#FFFFFF'
                }*/
            },
            {
                id       : 'access',
                title    : 'Controllo Accessi',
                translate: 'NAV.LOG.TITLE',
                type     : 'item',
                icon     : 'security',
                url      : '/myaccesses'/*,
                badge    : {
                    title    : '25',
                    translate: 'NAV.DASHBOARD.BADGE',
                    bg       : '#F44336',
                    fg       : '#FFFFFF'
                }*/
            },
            {
                id       : 'configurations',
                title    : 'Configurazioni',
                translate : 'NAV.CONFIG.TITLE',
                type     : 'collapsable',
                icon     : 'settings',
                children : [
                    {
                        id        : 'categories',
                        title     : 'Gestione Categorie',
                        translate : 'NAV.CATEGORIES.TITLE',
                        type      : 'item',
                        icon      : 'category',
                        url       : '/categoriesmanager',
                        exactMatch: true
                    },
                    {
                        id        : 'skills',
                        title     : 'Gestione Mansioni',
                        translate : 'NAV.SKILLS.TITLE',
                        type      : 'item',
                        icon      : 'power',
                        url       : '/skillsmanager',
                        exactMatch: true
                    },
                    {
                        id        : 'resources',
                        title     : 'Gestione Risorse',
                        translate : 'NAV.RESOURCES.TITLE',
                        type      : 'item',
                        icon      : 'group_work',
                        url       : '/resourcesmanager',
                        exactMatch: true
                    },
                    {
                        id        : 'customers',
                        title     : 'Gestione Clienti',
                        translate : 'NAV.CUSTOMERS.TITLE',
                        type      : 'item',
                        icon      : 'groups',
                        url       : '/customersmanager',
                        exactMatch: true
                    },
                    {
                        id        : 'vendors',
                        title     : 'Gestione Fornitori',
                        translate : 'NAV.VENDORS.TITLE',
                        type      : 'item',
                        icon      : 'business_center',
                        url       : '/vendorsmanager',
                        exactMatch: true
                    },
                    {
                        id        : 'eventtypes',
                        title     : 'Tipi di Evento',
                        translate : 'NAV.EVENTTYPES.TITLE',
                        type      : 'item',
                        icon      : 'event_note',
                        url       : '/eventtypesmanager',
                        exactMatch: true
                    },
                    {
                        id        : 'circles',
                        title     : 'Cerchie',
                        translate : 'NAV.CIRCLES.TITLE',
                        type      : 'item',
                        icon      : 'supervised_user_circle',
                        url       : '/circlesmanager',
                        exactMatch: true
                    },
                    {
                        id        : 'myusers',
                        title     : 'I miei utenti',
                        translate : 'NAV.MYUSERS.TITLE',
                        type      : 'item',
                        icon      : 'people',
                        url       : '/myusermanager',
                        exactMatch: true
                    },
                    {
                        id       : 'warehouse',
                        title    : 'Magazzino',
                        translate: 'NAV.WAREHOUSE.TITLE',
                        type     : 'item',
                        icon     : 'store',
                        url      : '/warehousemanager'/*,
                        badge    : {
                            title    : '25',
                            translate: 'NAV.DASHBOARD.BADGE',
                            bg       : '#F44336',
                            fg       : '#FFFFFF'
                        }*/
                    },
                    {
                        id       : 'business',
                        title    : 'Le mie Attività',
                        translate: 'NAV.MYBUSINESS.TITLE',
                        type     : 'item',
                        icon     : 'business',
                        url      : '/mybusiness'/*,
                        badge    : {
                            title    : '25',
                            translate: 'NAV.DASHBOARD.BADGE',
                            bg       : '#F44336',
                            fg       : '#FFFFFF'
                        }*/
                    },
                    {
                        id       : 'package',
                        title    : 'Gestione Pacchetti',
                        translate: 'NAV.PACKAGE.TITLE',
                        type     : 'item',
                        icon     : 'playlist_add',
                        url      : '/packagesmanager'/*,
                        badge    : {
                            title    : '25',
                            translate: 'NAV.DASHBOARD.BADGE',
                            bg       : '#F44336',
                            fg       : '#FFFFFF'
                        }*/
                    },
                    {
                        id       : 'firstnoteconf',
                        title    : 'Prima Nota',
                        translate : 'NAV.FIRST_NOTE_CONF.TITLE',
                        type     : 'collapsable',
                        icon     : 'note',
                        children : [{
                            id        : 'accounts',
                            title     : 'Configurazione Conti',
                            translate : 'NAV.ACCOUNTS_CONF.TITLE',
                            type      : 'item',
                            icon      : 'notes',
                            url       : '/accountsmanager',
                            exactMatch: true
                        },
                        {
                            id        : 'firstnotecategory',
                            title     : 'Configurazione Categorie',
                            translate : 'NAV.FN_CATEGORI.TITLE',
                            type      : 'item',
                            icon      : 'category',
                            url       : '/fncategoriesmanager',
                            exactMatch: true
                        }]
                    },
                    {
                      id   : 'calendar_entertrainer_availability',
                      translate: 'NAV.ENTERTRAINER_AVAILABILITY.TITLE',
                      title: 'Disponibilità di animatori',
                      type : 'item',
                      icon : 'today',
                      url  : '/entertrainersmanager'
                    }
                ]
            },

        ]
    }
];

export const navigationColleborator: FuseNavigation[] = [
  {
      id       : 'applications',
      title    : 'Applicazioni',
      translate: 'NAV.APPLICATIONS',
      type     : 'group',
      children : [
          {
              id       : 'home',
              title    : 'Home',
              translate: 'NAV.DASHBOARD.TITLE',
              type     : 'item',
              icon     : 'home',
              url      : '/home'/*,
              badge    : {
                  title    : '25',
                  translate: 'NAV.DASHBOARD.BADGE',
                  bg       : '#F44336',
                  fg       : '#FFFFFF'
              }*/
          },
          {
              id       : 'calendars',
              title    : 'Calendari',
              translate: 'NAV.CALENDARS.TITLE',
              type     : 'collapsable',
              icon     : 'calendar_today',
              children : [
                  {
                      id   : 'calendar_events',
                      translate: 'NAV.EVENTS_RESOURCE.TITLE',
                      title: 'Eventi e Risorse',
                      type : 'item',
                      icon     : 'today',
                      url      : '/dashboard'
                  }
              ]
          },
          {
              id       : 'events',
              title    : 'Eventi',
              translate: 'NAV.EVENTS.TITLE',
              type     : 'item',
              icon     : 'event',
              url      : '/eventsmanager'/*,
              badge    : {
                  title    : '25',
                  translate: 'NAV.DASHBOARD.BADGE',
                  bg       : '#F44336',
                  fg       : '#FFFFFF'
              }*/
          },
          // {
          //     id       : 'todo',
          //     title    : 'To Do List',
          //     translate: 'NAV.TODO.TITLE',
          //     type     : 'item',
          //     icon     : 'list',
          //     url      : '/todolistmanager'/*,
          //     badge    : {
          //         title    : '25',
          //         translate: 'NAV.DASHBOARD.BADGE',
          //         bg       : '#F44336',
          //         fg       : '#FFFFFF'
          //     }*/
          // },
          // {
          //     id       : 'appoint',
          //     title    : 'Appuntamenti',
          //     translate: 'NAV.APPOINTMENT.TITLE',
          //     type     : 'item',
          //     icon     : 'contact_phone',
          //     url      : '/appointments'/*,
          //     badge    : {
          //         title    : '25',
          //         translate: 'NAV.DASHBOARD.BADGE',
          //         bg       : '#F44336',
          //         fg       : '#FFFFFF'
          //     }*/
          // },
          // {
          //     id       : 'firstnote',
          //     title    : 'Prima nota',
          //     translate: 'NAV.FIRST_NOTE.TITLE',
          //     type     : 'item',
          //     icon     : 'iso',
          //     url      : '/firstnote'/*,
          //     badge    : {
          //         title    : '25',
          //         translate: 'NAV.DASHBOARD.BADGE',
          //         bg       : '#F44336',
          //         fg       : '#FFFFFF'
          //     }*/
          // },
          {
              id       : 'warehouse',
              title    : 'Movimenti di Magazzino',
              translate: 'NAV.MOVEMENTS.TITLE',
              type     : 'item',
              icon     : 'store',
              url      : '/movements'/*,
              badge    : {
                  title    : '25',
                  translate: 'NAV.DASHBOARD.BADGE',
                  bg       : '#F44336',
                  fg       : '#FFFFFF'
              }*/
          },
          // {
          //     id       : 'access',
          //     title    : 'Controllo Accessi',
          //     translate: 'NAV.LOG.TITLE',
          //     type     : 'item',
          //     icon     : 'security',
          //     url      : '/myaccesses'/*,
          //     badge    : {
          //         title    : '25',
          //         translate: 'NAV.DASHBOARD.BADGE',
          //         bg       : '#F44336',
          //         fg       : '#FFFFFF'
          //     }*/
          // },
          {
              id       : 'configurations',
              title    : 'Configurazioni',
              translate : 'NAV.CONFIG.TITLE',
              type     : 'collapsable',
              icon     : 'settings',
              children : [
                  {
                      id        : 'categories',
                      title     : 'Gestione Categorie',
                      translate : 'NAV.CATEGORIES.TITLE',
                      type      : 'item',
                      icon      : 'category',
                      url       : '/categoriesmanager',
                      exactMatch: true
                  },
                  {
                      id        : 'skills',
                      title     : 'Gestione Mansioni',
                      translate : 'NAV.SKILLS.TITLE',
                      type      : 'item',
                      icon      : 'power',
                      url       : '/skillsmanager',
                      exactMatch: true
                  },
                  {
                      id        : 'resources',
                      title     : 'Gestione Risorse',
                      translate : 'NAV.RESOURCES.TITLE',
                      type      : 'item',
                      icon      : 'group_work',
                      url       : '/resourcesmanager',
                      exactMatch: true
                  },
                  {
                      id        : 'customers',
                      title     : 'Gestione Clienti',
                      translate : 'NAV.CUSTOMERS.TITLE',
                      type      : 'item',
                      icon      : 'groups',
                      url       : '/customersmanager',
                      exactMatch: true
                  },
                  {
                      id        : 'vendors',
                      title     : 'Gestione Fornitori',
                      translate : 'NAV.VENDORS.TITLE',
                      type      : 'item',
                      icon      : 'business_center',
                      url       : '/vendorsmanager',
                      exactMatch: true
                  },
                  {
                      id        : 'eventtypes',
                      title     : 'Tipi di Evento',
                      translate : 'NAV.EVENTTYPES.TITLE',
                      type      : 'item',
                      icon      : 'event_note',
                      url       : '/eventtypesmanager',
                      exactMatch: true
                  },
                  {
                      id        : 'circles',
                      title     : 'Cerchie',
                      translate : 'NAV.CIRCLES.TITLE',
                      type      : 'item',
                      icon      : 'supervised_user_circle',
                      url       : '/circlesmanager',
                      exactMatch: true
                  },
                  {
                      id        : 'myusers',
                      title     : 'I miei utenti',
                      translate : 'NAV.MYUSERS.TITLE',
                      type      : 'item',
                      icon      : 'people',
                      url       : '/myusermanager',
                      exactMatch: true
                  },
                  {
                      id       : 'warehouse',
                      title    : 'Magazzino',
                      translate: 'NAV.WAREHOUSE.TITLE',
                      type     : 'item',
                      icon     : 'store',
                      url      : '/warehousemanager'/*,
                      badge    : {
                          title    : '25',
                          translate: 'NAV.DASHBOARD.BADGE',
                          bg       : '#F44336',
                          fg       : '#FFFFFF'
                      }*/
                  },
                  {
                      id       : 'business',
                      title    : 'Le mie Attività',
                      translate: 'NAV.MYBUSINESS.TITLE',
                      type     : 'item',
                      icon     : 'business',
                      url      : '/mybusiness'/*,
                      badge    : {
                          title    : '25',
                          translate: 'NAV.DASHBOARD.BADGE',
                          bg       : '#F44336',
                          fg       : '#FFFFFF'
                      }*/
                  },
                  {
                      id       : 'package',
                      title    : 'Gestione Pacchetti',
                      translate: 'NAV.PACKAGE.TITLE',
                      type     : 'item',
                      icon     : 'playlist_add',
                      url      : '/packagesmanager'/*,
                      badge    : {
                          title    : '25',
                          translate: 'NAV.DASHBOARD.BADGE',
                          bg       : '#F44336',
                          fg       : '#FFFFFF'
                      }*/
                  },
                  // {
                  //     id       : 'firstnoteconf',
                  //     title    : 'Prima Nota',
                  //     translate : 'NAV.FIRST_NOTE_CONF.TITLE',
                  //     type     : 'collapsable',
                  //     icon     : 'note',
                  //     children : [{
                  //         id        : 'accounts',
                  //         title     : 'Configurazione Conti',
                  //         translate : 'NAV.ACCOUNTS_CONF.TITLE',
                  //         type      : 'item',
                  //         icon      : 'notes',
                  //         url       : '/accountsmanager',
                  //         exactMatch: true
                  //     },
                  //     {
                  //         id        : 'firstnotecategory',
                  //         title     : 'Configurazione Categorie',
                  //         translate : 'NAV.FN_CATEGORI.TITLE',
                  //         type      : 'item',
                  //         icon      : 'category',
                  //         url       : '/fncategoriesmanager',
                  //         exactMatch: true
                  //     }]
                  // }
              ]
          },

      ]
  }
];

export const navigationEntertrainer: FuseNavigation[] = [
  {
      id       : 'applications',
      title    : 'Applicazioni',
      translate: 'NAV.APPLICATIONS',
      type     : 'group',
      children : [
          {
              id       : 'home',
              title    : 'Home',
              translate: 'NAV.DASHBOARD.TITLE',
              type     : 'item',
              icon     : 'home',
              url      : '/home'/*,
              badge    : {
                  title    : '25',
                  translate: 'NAV.DASHBOARD.BADGE',
                  bg       : '#F44336',
                  fg       : '#FFFFFF'
              }*/
          },
          {
              id       : 'calendars',
              title    : 'Calendari',
              translate: 'NAV.CALENDARS.TITLE',
              type     : 'collapsable',
              icon     : 'calendar_today',
              children : [
                  {
                      id   : 'calendar_events',
                      translate: 'NAV.EVENTS_RESOURCE.TITLE',
                      title: 'Eventi e Risorse',
                      type : 'item',
                      icon     : 'today',
                      url      : '/dashboard'
                  }
              ]
          },
          {
              id       : 'events',
              title    : 'Eventi',
              translate: 'NAV.EVENTS.TITLE',
              type     : 'item',
              icon     : 'event',
              url      : '/eventsmanager'/*,
              badge    : {
                  title    : '25',
                  translate: 'NAV.DASHBOARD.BADGE',
                  bg       : '#F44336',
                  fg       : '#FFFFFF'
              }*/
          },
          // {
          //     id       : 'todo',
          //     title    : 'To Do List',
          //     translate: 'NAV.TODO.TITLE',
          //     type     : 'item',
          //     icon     : 'list',
          //     url      : '/todolistmanager'/*,
          //     badge    : {
          //         title    : '25',
          //         translate: 'NAV.DASHBOARD.BADGE',
          //         bg       : '#F44336',
          //         fg       : '#FFFFFF'
          //     }*/
          // },
          // {
          //     id       : 'appoint',
          //     title    : 'Appuntamenti',
          //     translate: 'NAV.APPOINTMENT.TITLE',
          //     type     : 'item',
          //     icon     : 'contact_phone',
          //     url      : '/appointments'/*,
          //     badge    : {
          //         title    : '25',
          //         translate: 'NAV.DASHBOARD.BADGE',
          //         bg       : '#F44336',
          //         fg       : '#FFFFFF'
          //     }*/
          // },
          // {
          //     id       : 'firstnote',
          //     title    : 'Prima nota',
          //     translate: 'NAV.FIRST_NOTE.TITLE',
          //     type     : 'item',
          //     icon     : 'iso',
          //     url      : '/firstnote'/*,
          //     badge    : {
          //         title    : '25',
          //         translate: 'NAV.DASHBOARD.BADGE',
          //         bg       : '#F44336',
          //         fg       : '#FFFFFF'
          //     }*/
          // },
          {
              id       : 'warehouse',
              title    : 'Movimenti di Magazzino',
              translate: 'NAV.MOVEMENTS.TITLE',
              type     : 'item',
              icon     : 'store',
              url      : '/movements'/*,
              badge    : {
                  title    : '25',
                  translate: 'NAV.DASHBOARD.BADGE',
                  bg       : '#F44336',
                  fg       : '#FFFFFF'
              }*/
          },
          // {
          //     id       : 'access',
          //     title    : 'Controllo Accessi',
          //     translate: 'NAV.LOG.TITLE',
          //     type     : 'item',
          //     icon     : 'security',
          //     url      : '/myaccesses'/*,
          //     badge    : {
          //         title    : '25',
          //         translate: 'NAV.DASHBOARD.BADGE',
          //         bg       : '#F44336',
          //         fg       : '#FFFFFF'
          //     }*/
          // },
          {
              id       : 'configurations',
              title    : 'Configurazioni',
              translate : 'NAV.CONFIG.TITLE',
              type     : 'collapsable',
              icon     : 'settings',
              children : [
                  {
                      id        : 'categories',
                      title     : 'Gestione Categorie',
                      translate : 'NAV.CATEGORIES.TITLE',
                      type      : 'item',
                      icon      : 'category',
                      url       : '/categoriesmanager',
                      exactMatch: true
                  },
                  {
                      id        : 'skills',
                      title     : 'Gestione Mansioni',
                      translate : 'NAV.SKILLS.TITLE',
                      type      : 'item',
                      icon      : 'power',
                      url       : '/skillsmanager',
                      exactMatch: true
                  },
                  {
                      id        : 'resources',
                      title     : 'Gestione Risorse',
                      translate : 'NAV.RESOURCES.TITLE',
                      type      : 'item',
                      icon      : 'group_work',
                      url       : '/resourcesmanager',
                      exactMatch: true
                  },
                  {
                      id        : 'customers',
                      title     : 'Gestione Clienti',
                      translate : 'NAV.CUSTOMERS.TITLE',
                      type      : 'item',
                      icon      : 'groups',
                      url       : '/customersmanager',
                      exactMatch: true
                  },
                  {
                      id        : 'vendors',
                      title     : 'Gestione Fornitori',
                      translate : 'NAV.VENDORS.TITLE',
                      type      : 'item',
                      icon      : 'business_center',
                      url       : '/vendorsmanager',
                      exactMatch: true
                  },
                  {
                      id        : 'eventtypes',
                      title     : 'Tipi di Evento',
                      translate : 'NAV.EVENTTYPES.TITLE',
                      type      : 'item',
                      icon      : 'event_note',
                      url       : '/eventtypesmanager',
                      exactMatch: true
                  },
                  {
                      id        : 'circles',
                      title     : 'Cerchie',
                      translate : 'NAV.CIRCLES.TITLE',
                      type      : 'item',
                      icon      : 'supervised_user_circle',
                      url       : '/circlesmanager',
                      exactMatch: true
                  },
                  {
                      id        : 'myusers',
                      title     : 'I miei utenti',
                      translate : 'NAV.MYUSERS.TITLE',
                      type      : 'item',
                      icon      : 'people',
                      url       : '/myusermanager',
                      exactMatch: true
                  },
                  {
                      id       : 'warehouse',
                      title    : 'Magazzino',
                      translate: 'NAV.WAREHOUSE.TITLE',
                      type     : 'item',
                      icon     : 'store',
                      url      : '/warehousemanager'/*,
                      badge    : {
                          title    : '25',
                          translate: 'NAV.DASHBOARD.BADGE',
                          bg       : '#F44336',
                          fg       : '#FFFFFF'
                      }*/
                  },
                  {
                      id       : 'business',
                      title    : 'Le mie Attività',
                      translate: 'NAV.MYBUSINESS.TITLE',
                      type     : 'item',
                      icon     : 'business',
                      url      : '/mybusiness'/*,
                      badge    : {
                          title    : '25',
                          translate: 'NAV.DASHBOARD.BADGE',
                          bg       : '#F44336',
                          fg       : '#FFFFFF'
                      }*/
                  },
                  {
                      id       : 'package',
                      title    : 'Gestione Pacchetti',
                      translate: 'NAV.PACKAGE.TITLE',
                      type     : 'item',
                      icon     : 'playlist_add',
                      url      : '/packagesmanager'/*,
                      badge    : {
                          title    : '25',
                          translate: 'NAV.DASHBOARD.BADGE',
                          bg       : '#F44336',
                          fg       : '#FFFFFF'
                      }*/
                  },
                  // {
                  //     id       : 'firstnoteconf',
                  //     title    : 'Prima Nota',
                  //     translate : 'NAV.FIRST_NOTE_CONF.TITLE',
                  //     type     : 'collapsable',
                  //     icon     : 'note',
                  //     children : [{
                  //         id        : 'accounts',
                  //         title     : 'Configurazione Conti',
                  //         translate : 'NAV.ACCOUNTS_CONF.TITLE',
                  //         type      : 'item',
                  //         icon      : 'notes',
                  //         url       : '/accountsmanager',
                  //         exactMatch: true
                  //     },
                  //     {
                  //         id        : 'firstnotecategory',
                  //         title     : 'Configurazione Categorie',
                  //         translate : 'NAV.FN_CATEGORI.TITLE',
                  //         type      : 'item',
                  //         icon      : 'category',
                  //         url       : '/fncategoriesmanager',
                  //         exactMatch: true
                  //     }]
                  // }
                  {
                    id   : 'calendar_entertrainer_availability',
                    translate: 'NAV.ENTERTRAINER_AVAILABILITY.TITLE',
                    title: 'Disponibilità di animatori',
                    type : 'item',
                    icon : 'today',
                    url  : '/entertrainersmanager'
                  }
              ]
          },

      ]
  }
];

export const navigationCustomer: FuseNavigation[] = [
  {
      id       : 'applications',
      title    : 'Applicazioni',
      translate: 'NAV.APPLICATIONS',
      type     : 'group',
      children : [
          {
              id       : 'home',
              title    : 'Home',
              translate: 'NAV.DASHBOARD.TITLE',
              type     : 'item',
              icon     : 'home',
              url      : '/home'/*,
              badge    : {
                  title    : '25',
                  translate: 'NAV.DASHBOARD.BADGE',
                  bg       : '#F44336',
                  fg       : '#FFFFFF'
              }*/
          },
          {
              id       : 'calendars',
              title    : 'Calendari',
              translate: 'NAV.CALENDARS.TITLE',
              type     : 'collapsable',
              icon     : 'calendar_today',
              children : [
                  {
                      id   : 'calendar_events',
                      translate: 'NAV.EVENTS_RESOURCE.TITLE',
                      title: 'Eventi e Risorse',
                      type : 'item',
                      icon     : 'today',
                      url      : '/dashboard'
                  }
              ]
          },
          {
              id       : 'events',
              title    : 'Eventi',
              translate: 'NAV.EVENTS.TITLE',
              type     : 'item',
              icon     : 'event',
              url      : '/eventsmanager'/*,
              badge    : {
                  title    : '25',
                  translate: 'NAV.DASHBOARD.BADGE',
                  bg       : '#F44336',
                  fg       : '#FFFFFF'
              }*/
          },
          // {
          //     id       : 'todo',
          //     title    : 'To Do List',
          //     translate: 'NAV.TODO.TITLE',
          //     type     : 'item',
          //     icon     : 'list',
          //     url      : '/todolistmanager'/*,
          //     badge    : {
          //         title    : '25',
          //         translate: 'NAV.DASHBOARD.BADGE',
          //         bg       : '#F44336',
          //         fg       : '#FFFFFF'
          //     }*/
          // },
          // {
          //     id       : 'todo',
          //     title    : 'Appuntamenti',
          //     translate: 'NAV.APPOINTMENT.TITLE',
          //     type     : 'item',
          //     icon     : 'contact_phone',
          //     url      : '/appointments'/*,
          //     badge    : {
          //         title    : '25',
          //         translate: 'NAV.DASHBOARD.BADGE',
          //         bg       : '#F44336',
          //         fg       : '#FFFFFF'
          //     }*/
          // },
          // {
          //     id       : 'firstnote',
          //     title    : 'Prima nota',
          //     translate: 'NAV.FIRST_NOTE.TITLE',
          //     type     : 'item',
          //     icon     : 'iso',
          //     url      : '/firstnote'/*,
          //     badge    : {
          //         title    : '25',
          //         translate: 'NAV.DASHBOARD.BADGE',
          //         bg       : '#F44336',
          //         fg       : '#FFFFFF'
          //     }*/
          // },
          // {
          //     id       : 'warehouse',
          //     title    : 'Movimenti di Magazzino',
          //     translate: 'NAV.MOVEMENTS.TITLE',
          //     type     : 'item',
          //     icon     : 'store',
          //     url      : '/movements'/*,
          //     badge    : {
          //         title    : '25',
          //         translate: 'NAV.DASHBOARD.BADGE',
          //         bg       : '#F44336',
          //         fg       : '#FFFFFF'
          //     }*/
          // },
          // {
          //     id       : 'access',
          //     title    : 'Controllo Accessi',
          //     translate: 'NAV.LOG.TITLE',
          //     type     : 'item',
          //     icon     : 'security',
          //     url      : '/myaccesses'/*,
          //     badge    : {
          //         title    : '25',
          //         translate: 'NAV.DASHBOARD.BADGE',
          //         bg       : '#F44336',
          //         fg       : '#FFFFFF'
          //     }*/
          // },
          {
              id       : 'configurations',
              title    : 'Configurazioni',
              translate : 'NAV.CONFIG.TITLE',
              type     : 'collapsable',
              icon     : 'settings',
              children : [
                  // {
                  //     id        : 'categories',
                  //     title     : 'Gestione Categorie',
                  //     translate : 'NAV.CATEGORIES.TITLE',
                  //     type      : 'item',
                  //     icon      : 'category',
                  //     url       : '/categoriesmanager',
                  //     exactMatch: true
                  // },
                  // {
                  //     id        : 'skills',
                  //     title     : 'Gestione Mansioni',
                  //     translate : 'NAV.SKILLS.TITLE',
                  //     type      : 'item',
                  //     icon      : 'power',
                  //     url       : '/skillsmanager',
                  //     exactMatch: true
                  // },
                  {
                      id        : 'resources',
                      title     : 'Gestione Risorse',
                      translate : 'NAV.RESOURCES.TITLE',
                      type      : 'item',
                      icon      : 'group_work',
                      url       : '/resourcesmanager',
                      exactMatch: true
                  },
                  // {
                  //     id        : 'customers',
                  //     title     : 'Gestione Clienti',
                  //     translate : 'NAV.CUSTOMERS.TITLE',
                  //     type      : 'item',
                  //     icon      : 'groups',
                  //     url       : '/customersmanager',
                  //     exactMatch: true
                  // },
                  // {
                  //     id        : 'vendors',
                  //     title     : 'Gestione Fornitori',
                  //     translate : 'NAV.VENDORS.TITLE',
                  //     type      : 'item',
                  //     icon      : 'business_center',
                  //     url       : '/vendorsmanager',
                  //     exactMatch: true
                  // },
                  {
                      id        : 'eventtypes',
                      title     : 'Tipi di Evento',
                      translate : 'NAV.EVENTTYPES.TITLE',
                      type      : 'item',
                      icon      : 'event_note',
                      url       : '/eventtypesmanager',
                      exactMatch: true
                  },
                  // {
                  //     id        : 'circles',
                  //     title     : 'Cerchie',
                  //     translate : 'NAV.CIRCLES.TITLE',
                  //     type      : 'item',
                  //     icon      : 'supervised_user_circle',
                  //     url       : '/circlesmanager',
                  //     exactMatch: true
                  // },
                  // {
                  //     id        : 'myusers',
                  //     title     : 'I miei utenti',
                  //     translate : 'NAV.MYUSERS.TITLE',
                  //     type      : 'item',
                  //     icon      : 'people',
                  //     url       : '/myusermanager',
                  //     exactMatch: true
                  // },
                  // {
                  //     id       : 'warehouse',
                  //     title    : 'Magazzino',
                  //     translate: 'NAV.WAREHOUSE.TITLE',
                  //     type     : 'item',
                  //     icon     : 'store',
                  //     url      : '/warehousemanager'/*,
                  //     badge    : {
                  //         title    : '25',
                  //         translate: 'NAV.DASHBOARD.BADGE',
                  //         bg       : '#F44336',
                  //         fg       : '#FFFFFF'
                  //     }*/
                  // },
                  // {
                  //     id       : 'business',
                  //     title    : 'Le mie Attività',
                  //     translate: 'NAV.MYBUSINESS.TITLE',
                  //     type     : 'item',
                  //     icon     : 'business',
                  //     url      : '/mybusiness'/*,
                  //     badge    : {
                  //         title    : '25',
                  //         translate: 'NAV.DASHBOARD.BADGE',
                  //         bg       : '#F44336',
                  //         fg       : '#FFFFFF'
                  //     }*/
                  // },
                  // {
                  //     id       : 'package',
                  //     title    : 'Gestione Pacchetti',
                  //     translate: 'NAV.PACKAGE.TITLE',
                  //     type     : 'item',
                  //     icon     : 'playlist_add',
                  //     url      : '/packagesmanager'/*,
                  //     badge    : {
                  //         title    : '25',
                  //         translate: 'NAV.DASHBOARD.BADGE',
                  //         bg       : '#F44336',
                  //         fg       : '#FFFFFF'
                  //     }*/
                  // },
                  // {
                  //     id       : 'firstnoteconf',
                  //     title    : 'Prima Nota',
                  //     translate : 'NAV.FIRST_NOTE_CONF.TITLE',
                  //     type     : 'collapsable',
                  //     icon     : 'note',
                  //     children : [{
                  //         id        : 'accounts',
                  //         title     : 'Configurazione Conti',
                  //         translate : 'NAV.ACCOUNTS_CONF.TITLE',
                  //         type      : 'item',
                  //         icon      : 'notes',
                  //         url       : '/accountsmanager',
                  //         exactMatch: true
                  //     },
                  //     {
                  //         id        : 'firstnotecategory',
                  //         title     : 'Configurazione Categorie',
                  //         translate : 'NAV.FN_CATEGORI.TITLE',
                  //         type      : 'item',
                  //         icon      : 'category',
                  //         url       : '/fncategoriesmanager',
                  //         exactMatch: true
                  //     }]
                  // }
              ]
          },

      ]
  }
];

