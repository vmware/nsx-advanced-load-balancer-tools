import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ClrFormLayout } from '@clr/angular';
import * as l10n from './f5-report.l10n';
import { HttpService } from 'src/app/shared/http/http.service';
import { D3Service } from 'src/app/shared/d3.service';
import { ClrWizard } from "@clr/angular";
import * as d3 from 'd3';

const { ENGLISH: dictionary, ...l10nKeys } = l10n;

let colors = [
  "#225677",
  "#C9E0ED",
  "#945DB7",
  "#737373",
  "#454545",
  "#B0D3E5",
]
@Component({
  selector: 'f5-report',
  templateUrl: './f5-report.html',
  styleUrls: ['./f5-report.less'],
})
export class F5ReportComponent implements OnInit {

    dictionary = dictionary;

    levelOfComplexity: string;

    report: any;

    public openStartMigrationWizard: boolean = false;

    private margin = { top: 10, right: 10, bottom: 10, left: 10 };
    private width = 450;
    private height = 250;
    private svg: any;
    private colors: any = colors;
    private radius = Math.min(this.width, this.height) / 2 - this.margin.left;

    constructor(
        private http: HttpService,
        private d3: D3Service,
    ) {}

    ngOnInit(): void {
      this.http.get('discovery/getReport').subscribe((data)=> {
        this.report = data;
        const chart = [];
        const keys = Object.keys(this.report.virtualService.types);
        keys.forEach((key, index) => {
          const each = {
            name: key,
            value: this.report.virtualService.types[key],
            color: this.colors[index],
          };
          chart.push(each as never);
        });
        this.createSvg();
        this.createColors(chart);
        this.drawChart(chart);
      });
    }

    private createSvg(): void {
      this.svg = this.d3.d3
        .select("figure#donut")
        .append("svg")
        .attr("viewBox", `0 0 ${this.width} ${this.height}`)
        .append("g")
        .attr(
          "transform",
          "translate(" + this.width / 4 + "," + this.height / 2 + ")"
        );
    }

    private createColors(data: any): void {
      let index = 0;
      const defaultColors = [
        "#6773f1",
        "#32325d",
        "#6162b5",
        "#6586f6",
        "#8b6ced",
        "#1b1b1b",
        "#212121"
      ];
      const colorsRange: any = [];
      data.forEach(element => {
        if (element.color) colorsRange.push(element.color);
        else {
          colorsRange.push(defaultColors[index]);
          index++;
        }
      });
      this.colors = this.d3.d3
        .scaleOrdinal()
        .domain(data.map((d: any) => d.value.toString()))
        .range(colorsRange);
    }

    private drawChart(data): void {
      // Compute the position of each group on the pie:
      var pie = this.d3.d3
        .pie()
        .sort(null) // Do not sort group by size
        .value((d: any) => {
          return d.value;
        });
      var dataReady = pie(data as any);

      // The arc generator
      var arc = this.d3.d3
        .arc()
        .innerRadius(this.radius * 0.6) // This is the size of the donut hole
        .outerRadius(this.radius * 0.8);

      // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
      this.svg
        .selectAll("allSlices")
        .data(dataReady)
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", (d: any) => this.colors(d.data.value))
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .style("opacity", 0.7);

        var legendItemSize = 20;
        var legendSpacing = 4;

        var legend = this.svg
          .selectAll('.legend')
          .data(data)
          .enter()
          .append('g')
          .attr('class', 'legend')
          .attr('transform', (d, i) => {
            var height = legendItemSize + legendSpacing;
            var offset = data.length / 2;
            var x = legendItemSize * 10;
            var y = (i * height) - (offset*25);
            return `translate(${x}, ${y})`
          })

        legend
          .append('circle')
          .attr('cx', legendItemSize/10)
          .attr('cy', legendItemSize/2)
          .attr("r", 10)
          .style('fill', this.colors);

        legend
          .append('text')
          .attr('x', legendItemSize + legendSpacing)
          .attr('y', legendItemSize - legendSpacing)
          .text((d) => {
            return d.name + ' ' + d.value;
          })
    }

    public handleOpenStartMigrationWizard(): void {
        this.openStartMigrationWizard = true;
    }

    public handleCloseStartMigrationWizard(): void {
      this.openStartMigrationWizard = false;
  }

    getLevelText(): string {
      if(this.levelOfComplexity == 'low') {
        return this.dictionary.reportPageLevelLow;
      }
      else if(this.levelOfComplexity == 'medium') {
        return this.dictionary.reportPageLevelMedium;
      }
      else {
        return this.dictionary.reportPageLevelHigh;
      }
    }

    generateReport(): void {
      const reqBody = {
        f5_host_ip: '10.206.40.100',
        f5_ssh_user: 'admin',
        f5_ssh_password: 'AviNetworks123!'
      };

      this.http.post('discovery/generateReport', reqBody).subscribe(
        (data) => {
          console.log('Data from API:', data);
        },
        (error) => {
          console.error('Error from API:', error);
        }
      );
    }

    generateConfiguration(): void {
      const reqBody = {
        f5_host_ip: '10.206.40.100',
        f5_ssh_user: 'admin',
        f5_ssh_password: 'admin',
        avi_lab_ip:'10.10.10.10',
        avi_lab_user: 'admin',
        avi_lab_password: 'admin',
        avi_destination_ip: '10.10.10.10',
        avi_destination_user: 'admin',
        avi_destination_password: 'admin',
        avi_destination_version: '30.2.1',
        avi_mapped_vrf: 'global', 
        avi_mapped_tenant: 'admin', 
        avi_mapped_cloud: 'Default-Cloud',
        avi_mapped_segroup: 'Default-Group',
      };

      this.http.post('configuration/generateConfiguration', reqBody).subscribe(
        (data) => {
          console.log('Data from API:', data);
        },
        (error) => {
          console.error('Error from API:', error);
        }
      );
    }

    getAviLabDetails(): void {
      this.http.get('core/getAviLabDetails').subscribe(
        (data) => {
          console.log('Data from getAviLabDetails API:', data)
        },
        (error) => {
          console.error('Error from getAviLabDetails API:', error);
        }
      );
    }

    getAviDestinationDetails(): void {
      this.http.get('core/getAviDestinationDetails').subscribe(
        (data) => {
          console.log('Data from getAviDestinationDetails API:', data)
        },
        (error) => {
          console.error('Error from getAviDestinationDetails API:', error);
        }
      );
    }

    generatePlaybook(): void {
      const reqBody = {
        playbookName: 'playbookTest_1',
        f5_host_ip: '10.206.40.100',
      };

      this.http.post('playbook/generatePlaybook', reqBody).subscribe(
        (data) => {
          console.log('Data from generatePlaybook API:', data)
        },
        (error) => {
          console.error('Error from generatePlaybook API:', error);
        }
      );
    }

    saveAviLabDetails(): void {
      const reqBody = {
        avi_lab_ip:'10.10.102.102',
        avi_lab_user: 'admin',
        avi_lab_password: 'admin',
      };

      this.http.post('core/saveAviLabDetails', reqBody).subscribe(
        (data) => {
          console.log('Data save to DB:', data);
        },
        (error) => {
          console.error('Error in saving data:', error);
        }
      );
    }
}
