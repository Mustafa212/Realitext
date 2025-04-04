import { AfterViewInit, Component, inject, OnInit, signal } from '@angular/core';
import SplitType from 'split-type';
import { gsap } from 'gsap';
import { NavigationsService } from '../_services/navigations.service';
import { FormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import AOS from 'aos';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Color } from '@swimlane/ngx-charts';
import { ScaleType } from '@swimlane/ngx-charts';
import { GamingRobotComponent } from "../_lottie/gaming-robot/gaming-robot.component";
import { HiRobotComponent } from "../_lottie/hi-robot/hi-robot.component";
import { ModelService } from '../_services/model.service';
import { HotToastService } from '@ngneat/hot-toast';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, NgxChartsModule,NgClass, NgIf, GamingRobotComponent, HiRobotComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements AfterViewInit,OnInit {
  navService = inject(NavigationsService);
  modelService = inject(ModelService)
  private toast = inject(HotToastService)
  
  private splitTextInstance: SplitType | null = null;
  view: [number, number] = [440, 350];
  isTextareaActive = signal(false)
  // Color scheme definition
  colorScheme: Color = {
    name: 'coolScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#999']
  };
  text:string = ""
  HumanPercentage = 0
  AiPercentage = 0
  // Dummy data for the chart
  data: any[] = [
    { name: 'Luv u', value: 100 },
    
  ];
  loading = false

  // Toggle doughnut style if needed
  isDoughnut = false;

  ngOnInit(): void {
    AOS.init();

  }


  ngAfterViewInit(): void {
    if (this.navService.isAnimated()) {
      this.splitTextInstance = new SplitType('.Preloading', { types: 'chars' });
      const timeline = gsap.timeline();
      timeline
        .fromTo(
          this.splitTextInstance.chars,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.25,
            stagger: 0.1,
          }
        )
        .to('.Evilbot', {
          opacity: 1,
          left: '65%',
          rotation: 360,
          duration: 0.5,
          stagger: 0.1,
        })
        .fromTo(
          '.Goodbot',
          {
            opacity: 0,
            left: '65%',
            y: -100,
          },
          {
            y: 0,
            opacity: 1,
            left: '65%',
            duration: 0.3,
            ease: 'bounce.out',
          }
        )
        .to(
          '.Evilbot',
          {
            y: 100,
            opacity: 0,
            scale: 0.5,
            duration: 0.2,
          },
          '<'
        )
        .to('.Goodbot', {
          y: -20,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
          ease: 'power1.inOut',
        })
        .to('.Preloading', {
          top: '15%',
          left: '50%',
          duration: 0.5,
          ease: 'power1.inOut',
          fontSize: '52px',
        })
        .to(
          '.Goodbot',
          {
            opacity: 0,
            duration: 0.3,
            ease: 'power1.inOut',
          },
          '<'
        );

      timeline.then(() => {
        this.EndAnimation();
      });
    } else {
      gsap.to('.Preloading', {
        top: '15%',
        left: '50%',
        duration: 0,
        fontSize: '52px',
      });
    }
  }
  EndAnimation() {
    this.navService.isAnimated.update(() => false);
  }

  Analyse(){
    if (this.text =="") {
      // ToDO
      this.toast.warning('Please Enter Text!', {
        style: {
          background: '#ffcc00', // Dark purple background
          color: '#000000' // White text
        },
        icon: '⚠️'
      });
      return
      
    }
    this.loading = true
    console.log(this.text)
    this.modelService.classify(this.text).subscribe({
      next: (res) => {
        console.log(res)
        this.colorScheme = {
          name: 'coolScheme',
          selectable: true,
          group: ScaleType.Ordinal,
          domain: ['#E87BE1', '#10CFC9']
        }
        res.confidence =res.confidence * 100
        this.HumanPercentage = res.classification === "Human Generated" ? res.confidence : 100 - res.confidence
        this.AiPercentage = res.classification === "AI Generated" ? res.confidence : 100 - res.confidence
        this.HumanPercentage =  parseFloat(this.HumanPercentage.toFixed(2))
        this.AiPercentage = parseFloat(this.AiPercentage.toFixed(2))


        this.data =[
          { name: 'Human', value: this.HumanPercentage},
          { name: 'Ai', value:  this.AiPercentage },
        ]
        this.loading = false

      },
      error: (err) => {
        console.log(err)
        this.loading = false
      }
     
    })

  }
  ExtractPdf(e:any){
    console.log(e)
    const file = e.target.files[0];
  }
  ExtractWord(e:any){
    console.log(e)

  }
  ExtractTxt(e:any){
    console.log(e)


  }

  // inputText = '';
  // analysisResults: any = null;
  
  // // Chart configuration
  // colorScheme = {
  //   domain: ['#ff4757', '#2ed573']
  // };
  
  // confidenceChartData = [
  //   { name: 'AI', value: 0 },
  //   { name: 'Human', value: 0 }
  // ];

  // async analyzeText() {
  //   // Call your API here
  //   // For demo purposes:
  //   this.analysisResults = {
  //     aiConfidence: 75,
  //     humanConfidence: 25
  //   };
    
  //   this.updateChartData();
  // }

  // updateChartData() {
  //   this.confidenceChartData = [
  //     { name: 'AI', value: this.analysisResults.aiConfidence },
  //     { name: 'Human', value: this.analysisResults.humanConfidence }
  //   ];
  // }

  // handleFileUpload(event: any) {
  //   const file = event.target.files[0];
  //   // Handle file processing here
  // }

  // sendFeedback(isAccurate: boolean) {
  //   // Send feedback to API
  // }
  // showChart = false;
  // chart: Chart | null = null;
  // selectedFile: File | null = null;
  // data: any; // Stores JSON data dynamically

  // @ViewChild('lottieContainer', { static: true }) lottieContainer!: ElementRef;

  // constructor(private http: HttpClient) {}
  // ngAfterViewInit(): void {
  //   this.animateText();

  // }
  // animateText() {
  //   const text = new SplitType('#realitext', { types: 'chars' });

  //   gsap.from(text.chars, {
  //     opacity: 0,
  //     y: 20,
  //     duration: 0.4,
  //     stagger: 0.1,
  //     ease: 'power2.out'
  //   });
  // }
  // onFileSelected(event: Event) {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files && input.files.length > 0) {
  //     this.selectedFile = input.files[0];
  //     console.log('File selected:', this.selectedFile.name);
  //   }
  // }
  // generateChart() {
  //   if (!this.selectedFile) {
  //     alert('Please select a file first!');
  //     return;
  //   }

  //   this.showChart = true;

  //   setTimeout(() => {
  //     const canvas = document.getElementById('aiChart') as HTMLCanvasElement;

  //     if (canvas) {
  //       if (this.chart) {
  //         this.chart.destroy(); // Ensure no duplicate charts
  //       }

  //       this.chart = new Chart(canvas, {
  //         type: 'doughnut',
  //         data: {
  //           labels: ['AI Generated', 'Human Generated'],
  //           datasets: [
  //             {
  //               data: this.data ? this.data.values : [70, 30], // Uses JSON if available
  //               backgroundColor: ['#7F7FD5', '#E5C100'],
  //               hoverBackgroundColor: ['rgba(106, 13, 173, 1)', 'rgba(255, 140, 0, 1)'],
  //               borderColor: 'rgba(255, 255, 255, 0.8)',
  //               borderWidth: 2,
  //               borderRadius: 10
  //             }
  //           ]
  //         },
  //         options: {
  //           responsive: true,
  //           cutout: '45%',
  //           animation: { animateScale: true, animateRotate: true },
  //           plugins: {
  //             legend: {
  //               labels: {
  //                 color: '#222222',
  //                 font: { weight: 'bold', size: 14 }
  //               }
  //             }
  //           }
  //         }
  //       });
  //     }
  //   }, 100);
  // }
}
