import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { Circle } from 'app/models/circle.model';

import { locale as english } from '../i18n/en';
import { locale as italian } from '../i18n/it';
import { CirclesService } from './circles.service';
declare var gapi: any;

@Component({
    selector: 'circlesmanager',
    templateUrl: './circles.component.html',
    styleUrls: ['./circles.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class CirclesComponent implements OnInit, OnDestroy {
    /**
     * Constructor
     *
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */
    private circles: Circle[];
    displayedColumns = ['num-auto', 'oid', 'acronym', 'descr'];
    dataSource: MatTableDataSource<Circle>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true })
    sort: MatSort;


    @ViewChild('filter', { static: true })
    filter: ElementRef;

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _circlesmanagerService: CirclesService,
        private _matSnackBar: MatSnackBar
    ) {
        this._fuseTranslationLoaderService.loadTranslations(english, italian);
    }


    ngOnInit(): void {
        this._circlesmanagerService.getCircles().subscribe((circles: Circle[]) => {
            this.circles = circles;
            this.dataSource = new MatTableDataSource(this.circles);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator
        }, error => console.error(error));
        //setTimeout(() => this.dataSource.paginator = this.paginator)
    }

    public doFilter = (value: string) => {
        this.dataSource.filter = value.trim().toLocaleLowerCase();
    }


    public exportCircle() {
        console.log("exportCircle")
        const discoveryDocs = [
            'https://people.googleapis.com/$discovery/rest?version=v1'
        ];
        gapi.client.load('oauth2', 'v2', this.initClient(discoveryDocs));
    }

    initClient(discoveryDocs) {
        gapi.client.init({
            'apiKey': 'AIzaSyBXs5K2oJI3RSb1W9qLX224WIjSP8bjwCc',
            'discoveryDocs': discoveryDocs,
            'clientId': '35677411019-1m5gvmu0usj7r6des4pki35jq25oo9g0.apps.googleusercontent.com',
            'scope': 'https://www.googleapis.com/auth/contacts'
        }).then(() => {
            // Listen for sign-in state changes.
            gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus);
            // Handle the initial sign-in state.
            this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        }, (error) => {
            console.log(error);
            console.log(JSON.stringify(error, null, 2));
            this._matSnackBar.open(error.details, 'OK', {
                verticalPosition: 'top',
                duration: 4000
            });
        });
    }

    updateSigninStatus(isSignedIn) {
        if (isSignedIn) {
            return gapi.client.people.people.connections.list({
                'resourceName': 'people/me',
                'personFields': 'externalIds',
            }).then((response) => {
                var connections = response.result.connections;

                this.circles.forEach(async circle => {
                    let groupName = "";
                    await gapi.client.people.contactGroups.list({
                    }).then(async (response) => {
                        var groups = response.result.contactGroups;
                        let i = 0;
                        for (i = 0; i < groups.length; i++) {
                            if (groups[i].name == circle.descr) {
                                groupName = groups[i].resourceName;
                                break;
                            }
                        }
                        if (groupName == "") {
                            await gapi.client.people.contactGroups.create({
                                contactGroup: { name: circle.descr }
                            }).then(function (response) {
                                groupName = response.result.resourceName;
                            });
                        }
                        circle.circle_customer_assoc.forEach(async customerAssoc => {

                            let persondOid = "";
                            let person_id = ""
                            let etag = "";
                            if (connections.length > 0) {
                                let i = 0;
                                for (i = 0; i < connections.length; i++) {
                                    var person = connections[i];
                                    if (person.externalIds && person.externalIds.length > 0 && person.externalIds[0].value == customerAssoc.customer.oid) {
                                        persondOid = person.externalIds[0].value;
                                        person_id = person.resourceName;
                                        etag = person.etag;
                                        break;
                                    }
                                }
                            } else {
                                console.log('No connections found.');
                            }


                            if (persondOid == "") {
                                await gapi.client.people.people.createContact({
                                    "personFields": "names",
                                    "sources": [
                                        "READ_SOURCE_TYPE_CONTACT"
                                    ],
                                    "prettyPrint": true,
                                    "alt": "json",
                                    "resource": {
                                        "names": [
                                            {
                                                "givenName": customerAssoc.customer.name,
                                                "familyName": customerAssoc.customer.surname
                                            }
                                        ],
                                        "addresses": {
                                            "streetAddress": customerAssoc.customer.address
                                        },
                                        "emailAddresses": [
                                            {
                                                "value": customerAssoc.customer.email
                                            }
                                        ],
                                        "phoneNumbers": [
                                            {
                                                "value": customerAssoc.customer.tel
                                            },
                                            {
                                                "value": customerAssoc.customer.cell
                                            }
                                        ],
                                        "memberships": [
                                            {
                                                "contactGroupMembership": {
                                                    "contactGroupResourceName": groupName
                                                }
                                            }
                                        ],
                                        "externalIds": [
                                            {
                                                "value": customerAssoc.customer.oid
                                            }
                                        ]
                                    }
                                }).then(function (response) {
                                    console.log(response)
                                });
                            }
                            else {
                                console.log("update contact")
                                await gapi.client.people.people.updateContact({
                                    resourceName: person_id,
                                    etag: etag,
                                    updatePersonFields: "names,addresses,emailAddresses,phoneNumbers,memberships,externalIds",
                                    names: [
                                        {
                                            givenName: customerAssoc.customer.name,
                                            familyName: customerAssoc.customer.surname
                                        }
                                    ],
                                    addresses: {
                                        streetAddress: customerAssoc.customer.address
                                    },
                                    emailAddresses: [
                                        {
                                            value: customerAssoc.customer.email
                                        }
                                    ],
                                    phoneNumbers: [
                                        {
                                            value: customerAssoc.customer.tel
                                        },
                                        {
                                            value: customerAssoc.customer.cell
                                        }
                                    ],
                                    memberships: [
                                        {
                                            contactGroupMembership: {
                                                contactGroupResourceName: groupName
                                            }
                                        }
                                    ],
                                    externalIds: [
                                        {
                                            value: customerAssoc.customer.oid
                                        }
                                    ]
                                });
                            }
                        });
                    });
                });
                this._matSnackBar.open('Cerchie esportate', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });
            });
        } else {
            gapi.auth2.getAuthInstance().signIn().then(() => { console.log("signIn Google") },
                (error) => {
                    console.log(error)
                    if (error.error == 'popup_blocked_by_browser') {   
                        this._matSnackBar.open('Si prega di consentire il popup per questa app', 'OK', {
                            verticalPosition: 'top',
                            duration: 4000
                        });
                    }
                    if (error.error == 'popup_closed_by_user') {
                        this._matSnackBar.open('Si prega di selezionare un utente Google', 'OK', {
                            verticalPosition: 'top',
                            duration: 4000
                        });
                    }
                })
        }
    }




    ngOnDestroy(): void {

    }


}
