import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';

import { AuthService } from '../../security/services/auth.service';
import { Router } from '@angular/router';
import { SHA256 } from "crypto-js";
import { MatCheckboxChange } from '@angular/material/checkbox';


@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class LoginComponent implements OnInit {
    @ViewChild('recaptcha', { static: true }) recaptchaElement: ElementRef;
    loginForm: FormGroup;
    hide: boolean = true;
    rememberMe: boolean = false;
    websiteErrMsg: string
    recaptcha: string;
    disabled: boolean = true;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private changeDetectorRef: ChangeDetectorRef

    ) {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: true
                },
                footer: {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.loginForm = this._formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
        this.addRecaptchaScript();
    }

    onChangeEvent(event: any) {
        this.websiteErrMsg = undefined;
    }

    onKeypressEvent(event: any) {
        this.websiteErrMsg = undefined;
    }

    remember(event: MatCheckboxChange): void {
        this.rememberMe = event.checked;
    }

    isDisabled() {
        //return false;
        if (this.loginForm.invalid || this.disabled) {
            return true;
        }
        if (this.loginForm.valid && !this.disabled) {
            return false;
        }
    }

    renderReCaptcha() {
        window['grecaptcha'].render(this.recaptchaElement.nativeElement, {
            'sitekey': '6Le1st8ZAAAAAN1a0FWNocjfSRg06T4-MptGSKNd',
            'callback': (response) => {
                this.disabled = false;
                this.recaptcha = response;
                this.changeDetectorRef.detectChanges();
                // console.log(this.recaptcha);
                // console.log(this.disabled);
            },
            'error-callback': (error) => {
                this.disabled = true;
                this.recaptcha = null;
                this.changeDetectorRef.detectChanges();
                console.log(error);
                console.log(this.disabled);
                window['grecaptcha']
            },
            'expired-callback': (error) => {
                this.disabled = true;
                this.recaptcha = null;
                this.changeDetectorRef.detectChanges();
                console.log(error);
                console.log(this.disabled);
            }
        });
    }

    addRecaptchaScript() {

        window['grecaptchaCallback'] = () => {
            this.renderReCaptcha();
        }

        (function (d, s, id, obj) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) { obj.renderReCaptcha(); return; }
            js = d.createElement(s); js.id = id;
            js.src = "https://www.google.com/recaptcha/api.js?onload=grecaptchaCallback&amp;render=explicit";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'recaptcha-jssdk', this));

    }

    login() {
        let credentials = this.loginForm.value;
        let pwdEncrypt = SHA256(credentials.password) + "";
        // console.log(">>>>>>>>", credentials);
        // console.log("<<<<<", pwdEncrypt);
        this.authService.login(credentials.username, pwdEncrypt, this.recaptcha, this.rememberMe).subscribe(() => {
            this.router.navigate(['/dashboard']);
        },
        err => {
            console.log("Error while Authenticating");
            this.websiteErrMsg = 'Error while Authenticating!';
            window['grecaptcha'].reset();
        });
    }
}
