import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation,Renderer2 } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';

import { PackageService } from './package.service';
import { Package } from 'app/models/package.model';
import * as _ from 'lodash';
import { Config } from 'app/app.config';
import { Resource } from 'app/models/resource.model';
import { ResourceService } from 'app/main/resourcesmanager/resource/resource.service';
import { CategoriesService } from 'app/main/categoriesmanager/categories/categories.service';
import { SkillsService } from 'app/main/skillsmanager/skills/skills.service';
import { ResourcesService } from 'app/main/resourcesmanager/resources/resources.service';
import { ResourceType } from 'app/models/resourceType.model';
import { Category } from 'app/models/category.model';
import { Skill } from 'app/models/skill.model';
import { EventService } from 'app/main/eventsmanager/event/event.service';
import { MatTabChangeEvent } from '@angular/material';
import { Router } from '@angular/router';


@Component({
    selector: 'packagesmanager',
    templateUrl: './package.component.html',
    styleUrls: ['./package.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class PackageComponent implements OnInit, OnDestroy {
    package: Package;
    pageType: string;
    packageForm: FormGroup;
    resourceTypes: ResourceType[];
    categories: Category[];
    skills: Skill[];
    resources: Resource[];
    resourcesNoShow: Resource[] = [];
    extras: any[];
    logoSrc: string = '';
    tabIndex = 0;
    dataSource: any;
    dataSourceExtra: any;
    logo: File;
    imageError: string;

    displayedColumns = ["resourceType", "category", "skill", "resource", "qta", "hours", "days", "price", "pricebt", "total_price", "note", "delete"];
    displayedColumnsExtra = ["extra_descr", "qta", "price", "total_price", "note", "delete"];
    
    @ViewChild('UploadFileInput', { static: false }) uploadFileInput: ElementRef;

    public filteredResourceTypes: ReplaySubject<ResourceType[]> = new ReplaySubject<ResourceType[]>(1);
    public resourceTypesFilterCtrl: FormControl = new FormControl();

    public filteredCategories: ReplaySubject<Category[]> = new ReplaySubject<Category[]>(1);
    public categoriesFilterCtrl: FormControl = new FormControl();

    public filteredSkills: ReplaySubject<Skill[]> = new ReplaySubject<Skill[]>(1);
    public skillsFilterCtrl: FormControl = new FormControl();

    public filteredResources: ReplaySubject<Resource[]> = new ReplaySubject<Resource[]>(1);
    public resourcesFilterCtrl: FormControl = new FormControl();


    public filteredExtras: ReplaySubject<string[]> = new ReplaySubject<string[]>(1);
    public extrasFilterCtrl: FormControl = new FormControl();

    @ViewChild('qrCodeElement', {static: false}) qrCodeElement: ElementRef;
    qrData: string;
    qrWidth = "300";
    
    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {EcommerceProductService} _ecommerceProductService
     * @param {FormBuilder} _formBuilder
     * @param {Location} _location
     * @param {MatSnackBar} _matSnackBar
     */
    constructor(
        private _packageService: PackageService,
        private _formBuilder: FormBuilder,
        private _location: Location,
        private _matSnackBar: MatSnackBar,
        private _resourceTypeService: ResourceService,
        private _categoriesService: CategoriesService,
        private _skillsService: SkillsService,
        private _resourcesService: ResourcesService,
        private _eventService: EventService,
        private router: Router,
        private renderer: Renderer2

    ) {
        // Set the default
        this.package = new Package();

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to update product on changes
        this._resourceTypeService.getResourceTypes().subscribe((resourceTypes: ResourceType[]) => {
            this.resourceTypes = resourceTypes;
            this.filteredResourceTypes.next(this.resourceTypes.slice());
        }, error => console.error(error));


        this._categoriesService.getCategories().subscribe((categories: Category[]) => {
            this.categories = categories;
            this.filteredCategories.next(this.categories.slice());
        }, error => console.error(error));

        this._skillsService.getSkills().subscribe((skills: Skill[]) => {
            this.skills = skills;
            this.filteredSkills.next(this.skills.slice());
        }, error => console.error(error));

        this._resourcesService.getResources().subscribe((resources: Resource[]) => {
            this.resources = resources.filter(res => Number(res.available) == 1);
            if (this.resourcesNoShow && this.resourcesNoShow.length > 0) {
                this.resourcesNoShow.forEach((res) => { this.resources.push(res) });
            }
            this.filteredResources.next(this.resources.slice());
        }, error => console.error(error));

        this._eventService.getExtras().subscribe((extras: any[]) => {
            this.extras = extras;
            this.filteredExtras.next(this.extras.slice());
        }, error => console.error(error));
        this._packageService.onMessageChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(pkg => {

                if (pkg) {
                    this.package = new Package(pkg);
                    this.logoSrc = "";

                    if (this.package.image) {
                        this.logoSrc = Config.prop.urlImages + "/packages/" + this.package.oid + "/" + this.package.image;
                    }
                    this.dataSource = this.package.package_details;
                    this.dataSourceExtra = this.package.extra_details;
                    this.pageType = 'edit';
                }
                else {
                    this.pageType = 'new';
                    this.package = new Package();
                }

                this.packageForm = this.createPackageForm();
            });
        this.resourceTypesFilterCtrl.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.filteredResourceType();
            });


        this.categoriesFilterCtrl.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.filteredCategory();
            });

        this.skillsFilterCtrl.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.filteredSkill();
            });

        this.resourcesFilterCtrl.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.filteredResource();
            });


        this.extrasFilterCtrl.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.filteredExtra();
            });
        
          // console.log(">>>", this.resource);
      // this.qrData = `
      //   Seleziona un Tipo di Risorsa: ${this.resource.resourceType.descr}\n
      //   Risorse ID: ${this.resource.oid} \n
      //   Codice: ${this.resource.code} \n
      //   Descrizione: ${this.resource.descr} \n
      //   Larqhezza in cm: ${this.resource.width} \n
      //   Altezza in cm: ${this.resource.height} \n
      //   Profondita in cm: ${this.resource.deep} \n
      //   peso in Kq: ${this.resource.weight}\n
      //   Image: ${this.resource.image} \n
      //   Note" ${this.resource.note} \n
      //   `;
      // console.log(this.router.url);
      this.qrData="https://www.gestirefacile.it" + this.router.url;
    }



    public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
        this.tabIndex = tabChangeEvent.index;
        //console.log(tabChangeEvent);
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create product form
     *
     * @returns {FormGroup}
     */
    createPackageForm(): FormGroup {
        this.packageForm = this._formBuilder.group({
            oid: [this.package.oid],
            name: [this.package.name],
            descr: [this.package.descr],
            image: [this.package.image],
            total_price: [this.package.total_price],
            enabled: [this.package.enabled],
            package_details: this.getPackageDetails(),
            extra_details: this.getExtraDetails()
        });
        return this.packageForm;
    }

    filter(val: string) {
        this.filteredExtras.next(
            this.extras.filter(el => el.extra_descr.indexOf(val) > -1)
        );
    }


    updateTotal(event) {

        let total: number = 0;
        let idx = 0;
        //let index = 0;
        this.packageDetails.value.forEach(element => {
            let price = 0;
            if (element.price) {
                if (element.price.indexOf(".") > -1 && element.price.indexOf(",") > -1) {
                    price = +(element.price.replace(".", "").replace(",", ".")) * element.qta;
                    total += price;
                }
                else if (element.price.indexOf(".") === -1 && element.price.indexOf(",") > -1) {
                    price = +(element.price.replace(",", ".")) * element.qta;
                    total += price;
                }
                else {
                    price = +element.price * element.qta;
                    total += price;
                }
                const controlArray = <FormArray>this.packageForm.get('package_details');
                controlArray.controls[idx].get('total_price').patchValue(price);
                //
            }
            idx = idx + 1;
        });
        idx = 0;
        this.extraDetails.value.forEach(element => {
            let price = 0;
            if (element.price) {
                if (element.price.indexOf(".") > -1 && element.price.indexOf(",") > -1) {
                    price = +(element.price.replace(".", "").replace(",", ".")) * element.qta;
                    total += price;
                }
                else if (element.price.indexOf(".") === -1 && element.price.indexOf(",") > -1) {
                    price = +(element.price.replace(",", ".")) * element.qta;
                    total += price;
                }
                else {
                    price = +element.price * element.qta;
                    total += price;
                }
                const controlArray = <FormArray>this.packageForm.get('extra_details');
                controlArray.controls[idx].get('total_price').patchValue(price);
                idx = idx + 1;
            }
        });
        let totalStr = (Math.round((total + Number.EPSILON) * 100) / 100 + "").replace(".", ",");

        this.package.total_price = totalStr;
        this.packageForm.get('total_price').patchValue(totalStr);

    }


    compareObjects(o1: any, o2: any): boolean {
        return o1 && o2 ? o1.oid === o2.oid : false;
    }

    getResourceName(res: Resource): string {
        if (res.descr != null && res.descr != '') {
            return res.descr;
        }
        if (res.name != null && res.name != '' && res.surname != null && res.surname != '') {
            return res.name + '-' + res.surname;
        }
    }

    getResourceImage(res: Resource) {
        return Config.prop.urlImages + "/resources/" + res.oid + "/" + res.image;
    }

    fileChangeEvent(fileInput: any) {

      if (fileInput.target.files && fileInput.target.files[0]) {
          const max_size = 10485760;
          const allowed_types = ['image/png', 'image/jpeg', 'image/gif', 'image/jpg', 'image/pjpeg'];

          if (fileInput.target.files[0].size > max_size) {
              this.imageError =
                  'Maximum size allowed is ' + max_size / 1000 + 'Mb';

              return false;
          }

          if (!_.includes(allowed_types, fileInput.target.files[0].type)) {
              this.imageError = 'Only Images are allowed ( JPG | PNG | GIF | PJPEG )';
              return false;
          }

          this.packageForm.get("image").setValue('');
          this.logo = null;
          Array.from(fileInput.target.files).forEach((file: File) => {
              console.log(file);
              this.package.image = file.name;
              this.packageForm.get("image").setValue(file.name);
              this.packageForm.get("image").markAsDirty();
              this.logo = file;
          });

          const reader = new FileReader();
          reader.onload = (e: any) => {
              const image = new Image();
              image.src = e.target.result;
              image.onload = rs => {

                  // Return Base64 Data URL
                  const imgBase64Path = e.target.result;
                  this.logoSrc = imgBase64Path;

              };
          };
          reader.readAsDataURL(fileInput.target.files[0]);

          // Reset File Input to Select Same file again
          this.uploadFileInput.nativeElement.value = "";
      } else {
          this.packageForm.get("image").setValue('');
          this.logo = null;
      }
  }

    private filteredResourceType() {
        if (!this.resourceTypes) {
            return;
        }
        // get the search keyword
        let search = this.resourceTypesFilterCtrl.value;
        if (!search) {
            this.filteredResourceTypes.next(this.resourceTypes.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the roles
        this.filteredResourceTypes.next(
            this.resourceTypes.filter(resourceType => JSON.stringify(resourceType).toLowerCase().indexOf(search) > -1)
        );
    }

    private filteredCategory() {
        if (!this.categories) {
            return;
        }
        // get the search keyword
        let search = this.categoriesFilterCtrl.value;
        if (!search) {
            this.filteredCategories.next(this.categories.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the roles
        this.filteredCategories.next(
            this.categories.filter(category => JSON.stringify(category).toLowerCase().indexOf(search) > -1)
        );
    }

    private filteredSkill() {
        if (!this.skills) {
            return;
        }
        // get the search keyword
        let search = this.skillsFilterCtrl.value;
        if (!search) {
            this.filteredSkills.next(this.skills.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the roles
        this.filteredSkills.next(
            this.skills.filter(skill => JSON.stringify(skill).toLowerCase().indexOf(search) > -1)
        );
    }

    private filteredResource() {
        if (!this.resources) {
            return;
        }
        // get the search keyword
        let search = this.resourcesFilterCtrl.value;
        if (!search) {
            this.filteredResources.next(this.resources.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the roles
        this.filteredResources.next(
            this.resources.filter(resource => JSON.stringify(resource).toLowerCase().indexOf(search) > -1)
        );
    }


    private filteredExtra() {
        if (!this.extras) {
            return;
        }
        // get the search keyword
        let search = this.extrasFilterCtrl.value;
        if (!search) {
            this.filteredExtras.next(this.extras.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the roles
        this.filteredExtras.next(
            this.extras.filter(el => JSON.parse(el).extra_descr.toLowerCase().indexOf(search) > -1)
        );
    }


    getPackageDetails(): FormArray {
        return new FormArray(this.package.package_details.map(item => new FormGroup({
            resourceType: new FormControl(item.resourceType),
            category: new FormControl(item.category),
            skill: new FormControl(item.skill),
            resource: new FormControl(item.resource),
            price: new FormControl(item.price),
            qta: new FormControl(item.qta),
            note: new FormControl(item.note),
            hours: new FormControl(item.hours),
            days: new FormControl(item.days),
            total_price: new FormControl(item.total_price)
        })));
    }


    get packageDetails() {
        return this.packageForm.get('package_details') as FormArray;
    }



    addResource() {
        this.packageDetails.push(new FormGroup({
            resourceType: new FormControl(null),
            category: new FormControl(null),
            skill: new FormControl(null),
            resource: new FormControl(new Resource()),
            is_extra: new FormControl(false),
            price: new FormControl(null),
            qta: new FormControl(1),
            note: new FormControl(null),
            hours: new FormControl(0),
            days: new FormControl(0),
            //hours: new FormControl(this.packageForm.get('total_hours').value),
            //days: new FormControl(this.packageForm.get('total_days').value),
            total_price: new FormControl(null)
        }));
        this.dataSource = this.packageDetails.value;
    }


    onSelectedOptionsChange(value, index) {
        console.log(value.replace('.', ','));
        const controlArray = <FormArray>this.packageForm.get('package_details');
        controlArray.controls[index].get('price').setValue(value.replace('.', ','));
        this.updateTotal(value);
    }

    onChangeResource(res: Resource, index) {

        let i = 0;
        const controlArray = <FormArray>this.packageForm.get('package_details');
        controlArray.controls.forEach(ctrl => {
            let resource:Resource = ctrl.get("resource").value;
            if (resource.oid == res.oid && i != index) {
                this._matSnackBar.open('Attenzione: Risorsa già selezionata!', 'OK', {
                    verticalPosition: 'top',
                    duration: 3000
                });
            }
            i = + 1;
        });



        if (res.prices && res.prices.length > 0) {
            res.prices.forEach(element => {
                if (element.default == 1) {
                    //const controlArray = <FormArray>this.eventForm.get('event_details');
                    this.packageDetails.controls[index].get('price').setValue(element.price.replace('.', ','));
                }
            })
        }
        let idx = index;
        if (res.resources_assoc && res.resources_assoc.length > 0) {
            res.resources_assoc.forEach(element => {
                let resource = this.resources.filter(el => el.oid == element.resourceAssoc.oid);
                if (resource[0]) {
                    this.packageDetails.push(new FormGroup({
                        resourceType: new FormControl(null),
                        category: new FormControl(null),
                        skill: new FormControl(null),
                        resource: new FormControl(resource[0]),
                        is_extra: new FormControl(false),
                        price: new FormControl(0),
                        qta: new FormControl(element.qta),
                        note: new FormControl(null),
                        hours: new FormControl(0),
                        days: new FormControl(0),
                        /*hours: new FormControl(this.eventForm.get('total_hours').value),
                        days: new FormControl(this.eventForm.get('total_days').value),*/
                        total_price: new FormControl(0)
                    }));
                    idx = idx +1;
                }
            });
            this.dataSource = this.packageDetails.value;
        }
        this.updateTotal(this.packageDetails.value);

    }

    deleteResource(idx: number) {
        const controlArray = <FormArray>this.packageForm.get('package_details');
        let res = controlArray.controls[idx].get('resource').value;

        this.packageDetails.removeAt(idx);
        if (res.resources_assoc && res.resources_assoc.length > 0) {
            res.resources_assoc.forEach(element => {
                let resource = this.resources.filter(el => el.oid == element.resourceAssoc.oid);
                let i = 0;
                controlArray.controls.forEach(ctrl => {
                    let rs: Resource = ctrl.get('resource').value;
                    if (rs.oid == resource[0].oid) {
                        this.packageDetails.removeAt(i);
                    }
                    i = i + 1;
                });

            });
        }
        this.dataSource = this.packageDetails.value;
        this.updateTotal(this.packageDetails.value);
        this.packageForm.markAsDirty();
    }



    getExtraDetails(): FormArray {
        return new FormArray(this.package.extra_details.map(item => new FormGroup({
            is_extra: new FormControl(item.is_extra),
            price: new FormControl(item.price),
            qta: new FormControl(item.qta),
            extra_descr: new FormControl(item.extra_descr),
            note: new FormControl(item.note),
            total_price: new FormControl(item.total_price)
        })));
    }


    get extraDetails() {
        return this.packageForm.get('extra_details') as FormArray;
    }



    addExtra() {
        this.extraDetails.push(new FormGroup({
            is_extra: new FormControl(true),
            price: new FormControl(null),
            qta: new FormControl(1),
            extra_descr: new FormControl(null),
            note: new FormControl(null),
            total_price: new FormControl(null)
        }));
        this.dataSourceExtra = this.extraDetails.value;
    }

    deleteExtra(idx: number) {
        this.extraDetails.removeAt(idx);
        this.dataSourceExtra = this.extraDetails.value;
        this.updateTotal(this.packageDetails.value);
        this.packageForm.markAsDirty();
    }

    /**
     * Add packages
     */
    async addPackage(): Promise<void> {


        const data = this.packageForm.getRawValue();
        console.log(">>>>>", data);
        console.log("<<<<<", this.logo);
        data.oid_user_create = 1;

        this._packageService.addPackage(data, this.logo)
            .then(() => {

                // Trigger the subscription with new data
                //this._packageService.onMessageChanged.next(data);

                // Show the success message
                this._matSnackBar.open('Pacchetto aggiunto', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });

                // Change the location with new one
                //this._location.go('apps/e-commerce/products/' + this.user.oid + '/' + this.user.handle);
            }, error => {
                this._matSnackBar.open('Errore aggiunta pacchetto!', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });
                console.log("Error addPackage " + error);
            });
    }


    /**
     * Save package
     */
    savePackage(): void {

        const data = this.packageForm.getRawValue();
        console.log(">>>>>", data);

        this._packageService.savePackage(data, this.logo)
            .then(() => {

                // Trigger the subscription with new data
                //this._packageService.onMessageChanged.next(data);

                // Show the success message
                this._matSnackBar.open('Pacchetto aggiornato', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });
            }, error => {
                this._matSnackBar.open('Errore aggiornamento pacchetto!', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });
                console.log("Error savePackage " + error);
            });
    }


    downloadQRCode(qrCodeElement) {
      // debugger;
      const link = this.renderer.createElement('a');
      link.download = 'qrcode.png';
      console.log(qrCodeElement)
      link.href = qrCodeElement.qrcElement.nativeElement.children[0].toDataURL();
      this.renderer.appendChild(document.body, link);
      link.click();
      this.renderer.removeChild(document.body, link);
    }




}

