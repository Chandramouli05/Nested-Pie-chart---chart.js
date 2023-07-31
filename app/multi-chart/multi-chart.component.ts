import { Component, AfterViewInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-multi-chart',
  templateUrl: './multi-chart.component.html',
  styleUrls: ['./multi-chart.component.css']
})
export class MultiChartComponent implements AfterViewInit {

  public chart: any;

  @ViewChild('multiSeriesPieChartCanvas') multiSeriesPieChartCanvas!: ElementRef;

  constructor(private renderer: Renderer2) { }

  ngAfterViewInit(): void {
    this.createChart();
  }

  createChart() {

    const outerLabels = ['car', 'bike', 'aeroplane', 'cycle', 'auto']; // Outer labels
    const outerData = [30, 40, 50, 60, 70];
    const innerData = [20, 50];
    const innerLabels = ['male', 'female'];

    // Calculate the total sum for the outer pie chart
    const outerSum = outerData.reduce((acc: number, data: number) => acc + data, 0);

    // Calculate the percentage for each outer slice
    const outerPercentages = outerData.map((data: number) => ((data * 100) / outerSum).toFixed(0) + '%');

    const chartData: any = {
      labels: outerLabels, // Outer labels
      datasets: [
        {
          data: outerData,
          backgroundColor: ['#F4D160', '#FBEEAC', '#03C988', '#68B984', '#50F306'], // Different colors for the outer pie chart labels
          radius: '30%', 
          borderWidth: 0, // Set the radius of the outer pie chart to 30% of the available space
          datalabels: {
            formatter: (value: number, ctx: any) => {
              const datasetData = ctx.dataset.data as number[]; // Get the data of the current dataset
              const index = ctx.dataIndex; // Get the index of the current data point
              const percentage = outerPercentages[index]; // Get the percentage for the current slice
              return outerLabels[index] + ': ' + value + ' (' + percentage + ')'; // Display data name, value, and percentage
            },
            color: '#fff', // Color of the data labels
            anchor: 'center',
            // Center-align the labels inside the slices
            offset: 0, // Set the offset to 0 to position the labels inside the slices
            labels: {
              title: {
                font: {
                  weight: 'bold'
                }
              }
            }
          }
        },

        {
          data: innerData,
          backgroundColor: ['#03C988', '#68B984'], // Different colors for the inner pie chart segments
          radius: '30%', // Set the radius of the inner pie chart to 20% of the available space
          borderWidth: 0, // Remove the borders to hide the hover effect for the inner pie chart
          hoverOffset: 0, // Remove hover offset to prevent the inner chart from moving on hover
          datalabels: {
            formatter: (value: number, ctx: any) => {
              const datasetData = ctx.dataset.data as number[]; // Get the data of the current dataset
              const index = ctx.dataIndex; // Get the index of the current data point
              const sum = datasetData.reduce((acc: number, data: number) => acc + data, 0); // Calculate the sum of data for the current dataset
              const percentage = ((value * 100) / sum).toFixed(0) + '%'; // Calculate the percentage and format it as a string
              return innerLabels[index] + ': ' + value + ' (' + percentage + ')'; // Display data name, value, and percentage
            },
            color: '#fff', // Color of the data labels
            anchor: 'center', // Center-align the labels inside the slices
            offset: 0, // Set the offset to 0 to position the labels inside the slices
            labels: {
              title: {
                font: {
                  weight: 'bold'
                }
              }
            }
          }
        }
      ]
    };

    const chartOptions: any = {
      responsive: true,
      plugins: {
        legend: {
          display: false // Hide the legend to avoid overlapping with the nested pie chart
        }
      },
      tooltips: {
        enabled: true, // Enable tooltips
        callbacks: {
          label: (tooltipItem: any, data: any) => {
            const datasetIndex = tooltipItem.datasetIndex;
            const index = tooltipItem.index;
            if (datasetIndex === 0) {
              const datasetData = data.datasets[datasetIndex].data as number[];
              const value = datasetData[index];
              const labelName = data.labels[index];
              const sum = datasetData.reduce((acc: number, data: number) => acc + data, 0);
              const percentage = ((value * 100) / sum).toFixed(0) + '%';
              return `${labelName}: ${value} (${percentage})`;
            } else {
              return data.labels[index];
            }
          }
        }
      },
      interaction: {
        mode: 'index' // Enable interactions, including hovering
      }
    };

    // Get the canvas element
    const canvas: HTMLCanvasElement = this.multiSeriesPieChartCanvas.nativeElement;
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;

    import('chartjs-plugin-datalabels').then((ChartDataLabels) => {

      // Create the pie chart using Chart.js
      this.chart = new Chart(ctx, {
        type: 'pie',
        data: chartData,
        options: chartOptions,
        plugins: [ChartDataLabels.default]
      });
    });
  }
}
