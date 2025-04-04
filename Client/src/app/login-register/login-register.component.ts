import { NgClass, NgIf, NgStyle } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit, signal } from '@angular/core';
import AOS from 'aos';
import { gsap } from 'gsap';
import SplitType from 'split-type';
import { AccountService } from '../_services/account.service';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { NavigationsService } from '../_services/navigations.service';


@Component({
  selector: 'app-login-register',
  standalone: true,
  imports: [NgIf,NgClass,ReactiveFormsModule,NgStyle],
  templateUrl: './login-register.component.html',
  styleUrl: './login-register.component.css'
})
export class LoginRegisterComponent implements AfterViewInit,OnInit{
  private toast = inject(HotToastService)
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private accountService = inject(AccountService);
  navService = inject(NavigationsService);

  form!: FormGroup;
  loading = false;
  errorMessage: string | null = null;


  maintxt = signal<string>("Log In")
  private splitTextInstance: SplitType | null = null;
  isSignUp = false
  ngOnInit(): void {
    this.initializeForm();

  }
  initializeForm() {
    if (this.isSignUp) {
      this.form = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required,this.matchValues('password') ]]
      });

      this.form.controls['password'].valueChanges.subscribe({
        next: ()=>{
          this.form.controls['confirmPassword'].updateValueAndValidity()
        }
      })

    } else {
      this.form = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required]
      });
    }
  }
  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }
  get confirmPassword() { return this.form.get('confirmPassword'); }
  private matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      const matchToControl = control.parent?.get(matchTo);
      return control.value === matchToControl?.value ? null : { isMatching: true };
    };
  }
  ngAfterViewInit(): void {
    this.initAnimation();
    AOS.init({
      once: false,
      duration: 300,
      offset: 100,
      easing: 'ease-in-out'
    });
   
  }
  private initAnimation() {
    // Clean up previous instances
    if (this.splitTextInstance) {
      this.splitTextInstance.revert();
      this.splitTextInstance = null;
    }

    // Create new animation
    this.splitTextInstance = new SplitType('.my-text', { types: 'chars' });
    
    gsap.fromTo(this.splitTextInstance.chars, 
      { opacity: 0 },
      { 
        opacity: 1,
        duration: 0.1,
        stagger: 0.1
      }
    );
  }

  ToggleSignUp() {
    this.maintxt.set("Sign Up");

    setTimeout(() => {
      this.isSignUp = !this.isSignUp
      this.initializeForm();
      this.errorMessage = null;
      
    },500)
    
    // Wait for Angular to update the DOM
    setTimeout(() => {
      this.initAnimation();
    },500);

    setTimeout(() => {
      this.changepage();
    },0);
  }

  changepage(){

    const timeline = gsap.timeline()


    timeline.to(".circle", 
      { 
      duration: 1,
      left:this.isSignUp?  "62%":"-30%",  
      backgroundColor:this.isSignUp?"#670a85": "#0AA885",
      ease: "power1.inOut"
      }
    )
    .to(".loginimg", 
      {
        left:this.isSignUp?  "45%":"18%",  
        duration: 1,
        ease: "power1.inOut"
      }, 0
    )
    .to(".loginimg2", 
      {
        // left:this.isSignUp?  "75%":"11%",  
        duration: 1,
        ease: "power1.inOut"
      }, 0
    )
    .to(".holdere", 
      {
        x:this.isSignUp?"50px":"650px",
        duration: 1,
        ease: "power1.inOut"
      }, 0
    )
    .to(".logo",
      {
        left:this.isSignUp?  "3%":"82%",
        color:this.isSignUp?  "#670a85":"#0AA885",
        duration: 1,
        ease: "power1.inOut"
      },0
    )
    .to(".women",
      {
        opacity:this.isSignUp?1:0,
        duration: 1,
        ease: "power1.inOut"
      },0
    )
    .to(".women",
      {
        display:this.isSignUp?"block":"none",
        duration: 1,
        ease: "power1.inOut"
      },0.6
    )
    .to(".man",
      {
        opacity:this.isSignUp?0:1,
        duration: 1,
        ease: "power1.inOut"
      },0
    )
    .to(".man",
      {
        display:this.isSignUp?"none":"block",
        bottom:"15%",
        duration: 1,
        ease: "power1.inOut"
      },0.7
    )
    // 
    .to(".plant1",
      {
        opacity:this.isSignUp?1:0,
        duration: 1,
        ease: "power1.inOut"
      },0
    )
    .to(".plant1",
      {
        display:this.isSignUp?"block":"none",
        duration: 1,
        ease: "power1.inOut"
      },0.6
    )
    .to(".plant2",
      {
        opacity:this.isSignUp?0:1,
        duration: 1,
        left:"23%",
        bottom:"18%",
        ease: "power1.inOut"
      },0
    )
    .to(".plant2",
      {
        display:this.isSignUp?"none":"block",
        duration: 1,
        ease: "power1.inOut"
      },0.7
    )
  }


  onSubmit() {
    if (this.form.invalid) return;

    this.loading = true;
    this.errorMessage = null;

    const { email, password } = this.form.value;

    if (this.isSignUp) {
      this.accountService.register(email, password).subscribe({
        next: (res) => {
    
          this.toast.show('Account Created Successfully!', {
            style: {
              background: '#670a85', // Dark purple background
              color: '#ffffff' // White text
            },
            icon: '🔥'
          });
          this.router.navigateByUrl('/login');
        },
        error: (err) => {
          console.log(err)
          this.errorMessage = err.message;
          this.loading = false;
        }
        ,
        complete:()=>{
          this.loading = false;

        }
      });

    } else {
      this.accountService.login(email, password).subscribe({
        next: () => {
          this.toast.show('Logged In Successfully!', {
            style: {
              background: '#670a85', // Dark purple background
              color: '#ffffff' // White text
            },
            icon: '🔥'
          });
          this.router.navigateByUrl("/home")

        },
        error: (err) => {
          console.log(err)
          this.errorMessage = err.message;
          this.loading = false;
        },
        complete:()=>{
          this.loading = false;
          this.navService.isLoggingIn.set(false);


        }
      });
      
    }
  }


  NavigatetoHome(){
    this.router.navigate(['/']);
    this.navService.isLoggingIn.set(false);
  }
}
