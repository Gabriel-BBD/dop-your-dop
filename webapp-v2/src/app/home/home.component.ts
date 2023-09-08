import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HeaderConfigModel } from '../models/shared.models';
import { ProfileComponent } from './profile/profile.component';
import { AlcoholicsComponent } from './alcoholics/alcoholics.component';
import { Chart } from 'angular-highcharts';
import { DrinksService } from '../services/drinks.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class HomeComponent implements OnInit {

  headerConfig!:HeaderConfigModel[];
  action!: Function;

  myForm!: FormGroup; // Define the form group

  tabConfig!: any[];
  chart!:Chart;
  headerIndex:number = 0;

  doOne:boolean = true;

  drinksData!: DrinksData[]

  constructor(
    private drinksService: DrinksService,
    private fb: FormBuilder
  ){}

  async ngOnInit() {
    this.myForm = this.fb.group({
      drink: ['', Validators.required],
      quantity: ['', [Validators.required]]
    });
    await this.getData()

    this.headerConfig = [
      {headerText: "Feeling Thirsty ?", buttonContent: "Have Another !", action: () => {
        this.openDialog()
      }},
      {headerText: "Drinking History", buttonContent: "Generate Timeline", action:() => {}},
    ]
    
    this.tabConfig = [
      {
        name: 'Alcoholics',
        component: {
          type: AlcoholicsComponent,
          id: 'basic',
          context:{
            input: {
              chart: this.chart
            }
          }
        },
      },
      {
        name: 'Profile',
        component: {
          type: ProfileComponent,
          id: 'surveyGroup',
          context:{
            input: {
              data: 'easy sui'
            }
          }
        },
      }
    ];
  }
  async getData(){
    const drinks:DrinksData[] = await this.drinksService.getDrinks();
    console.log(drinks);

    const categories = ['0', '1', '2', '3', '4', '5', '6',
    '7', '8', '9', '10', '11', '12', '13',
    '14', '15', '16', '17', '18', '19', '20',
    '21', '22', '23'];
    
    const seriesData = this.buildSeriesData(drinks, categories)
    this.chart = new Chart({
      chart: {
        type: 'line',
        backgroundColor: '#212121'
      },
      title: {
        text: 'Chart Demo',
        style: {
          color: '#faefb3', // Change the title text color
        },
      },
      xAxis: {
        categories: categories,
        title: {
          text: 'Time',
          style: {
            color: '#faefb3', // Change the x-axis title color
          },
        },
        labels: {
          style: {
            color: '#faefb3', // Change the x-axis labels color
          },
        },
      },
      
      yAxis: {
        min: 0,
        title: {
          text: 'Drank Drank',
          style: {
            color: '#faefb3', // Change the y-axis title color
          },
        },
        labels: {
          style: {
            color: '#faefb3', // Change the y-axis labels color
          },
        },
      },
      legend: {
        reversed: true,
        itemStyle: {
          color: '#faefb3', // Change the legend item text color
        },
      },
      plotOptions: {
        series: {
          stacking: 'normal',
          color: '#faefb3', // Change the line color
          marker: {
            fillColor: '#faefb3', // Change the marker fill color
            lineColor: '#faefb3', // Change the marker line color
          },
        },
      },
      series: seriesData,
    });
  }

  buildSeriesData(drinks:DrinksData[], times: string[]){
    const drinksSeries = drinks.reduce((acc:any, curr) => {
      if(!acc){
        acc = []
      }

      const existingIndex = acc.findIndex((entry:any) => {
        return entry.name === curr.drink
      })
      const formattedTime=this.roundToNearestHour(curr.time);
      const timeIndex = this.findTimeIndex(formattedTime, times);
      if(existingIndex>=0){
        if((timeIndex || timeIndex === 0) && timeIndex >=0){
          if(!acc[acc.length-1].data[timeIndex]){
            acc[existingIndex].data[timeIndex] = 0
          }
          acc[existingIndex].data[timeIndex] += this.roundToNearestWholeNumber(Number(curr.quantity));
        }
      }else{
        acc.push(
          {
            name: curr.drink,
            data:this.createArrayWithZeros(times.length),//look at times and get the position
            type:'line',
          }
        )
        if(timeIndex || timeIndex === 0 && timeIndex >= 0){
          if(!acc[acc.length-1].data[timeIndex]){
            acc[acc.length-1].data[timeIndex] = 0;
          }
          acc[acc.length-1].data[timeIndex] += this.roundToNearestWholeNumber(Number(curr.quantity))
        }
      }

      return acc;
    }, [])
    return drinksSeries;
  }

  roundToNearestWholeNumber(number: number): number {
    return Math.round(number);
  }
  

  createArrayWithZeros(length: number): number[] {
    const zerosArray: number[] = [];
    for (let i = 0; i < length; i++) {
      zerosArray.push(0);
    }
    return zerosArray;
  }

  roundToNearestHour(timestamp: string): { date: string; time: string } {

    const date = new Date(timestamp);
    const minutes = date.getMinutes();
    const roundedMinutes = Math.round(minutes / 60) * 60;
    date.setMinutes(roundedMinutes, 0, 0);

    const day = date.getDate().toString().padStart(2, '0'); // Day with leading zero
    const hour = date.getHours().toString().padStart(2, '0'); // Hour with leading zero

    return { date: day, time: hour };
  }

  findTimeIndex(input: { date: string; time: string }, times:string[]): number | undefined {
    const { time } = input;
    const index = times.indexOf(time);
    return index !== -1 ? index : undefined;
  }

  generateRandomData() {
    const data = [];
    for (let i = 0; i < 24; i++) {
      data.push(Math.floor(Math.random() * 100)); // Random data values (adjust range as needed)
    }
    return data;
  }

  doIt(index:number){
    this.headerIndex = index
  }

  isVisible: boolean = false;
  userInput: string = '';

  openDialog() {
    this.isVisible = true;
  }

  async submit() {
    // Handle the submitted text (e.g., display it)
    try {
      if(this.myForm.valid){
        const drink = this.myForm.get('drink')?.value;
        const quantity = this.myForm.get('quantity')?.value
        console.log(drink)
        console.log(quantity)
        const numberParse = Number(quantity)

        await this.drinksService.postDrink(drink,quantity)
        await this.getData()
        this.closeDialog();
      }
    } catch (error) {
      console.log(error)
    }
  }

  close() {
    this.closeDialog();
  }

  closeDialog() {
    this.isVisible = false;
    this.userInput = ''; // Clear the input field
  }
}

export interface DrinksData{
  drink:string
  quantity:string
  time:string
  username:string
}
