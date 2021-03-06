import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { EmitterService } from 'src/app/shared/emitter.service';
import { BasicuserService } from 'src/app/user/basicuser.service';
import { DialogViewProposalFormComponent } from '../dialog-view-proposal-form/dialog-view-proposal-form.component';
import { EmployeesService } from '../employees.service';
import * as _ from 'lodash';
import { DynamicStateApproved } from '../employees.model';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-req-to-put-on-hold',
  templateUrl: './req-to-put-on-hold.component.html',
  styleUrls: ['./req-to-put-on-hold.component.css']
})
export class ReqToPutOnHoldComponent implements OnInit {

  role: string;
  userId: number;
  displayedColumns: string[];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: any;
  putOnHoldData: any = [];

  districtId: number;
  districtData: any = [];
  dynamicStateApproved: DynamicStateApproved = new DynamicStateApproved();
  panchayatData: any = [];
  isDistrictSelected: boolean = false;

  constructor(
    public dialog: MatDialog,
    public employeeService: EmployeesService,
    public emitterService: EmitterService,
    public basicuserService: BasicuserService,
    public toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {
    sessionStorage.removeItem('language');
    sessionStorage.setItem('language', 'true');
    this.role = sessionStorage.getItem('role');
    this.userId = Number(sessionStorage.getItem('userId'));

    this.emitterService.isApproved.subscribe(val => {
      if (val) {
        if (this.role === 'DISTRICT') {
          this.getRequestToPutOnHoldDataByDistrict(this.userId);
        }
        if (this.role === 'GRAMPANCHAYAT') {
          this.getRequestToPutOnHoldDataByPanchayat(this.userId);
        }
        if (this.role === 'STATE') {
          this.getRequestToPutOnHoldByState();
          this.getDistrictMasterData();
        }
        if (this.role === 'ADMIN') {
          this.getRequestToPutOnHoldByAdmin();
          this.getDistrictMasterData();
        }
      }

    });




  }

  ngOnInit(): void {
    if (this.role === 'DISTRICT') {
      this.displayedColumns = ['artistCode', 'fullName', 'place', 'approvalStatus', 'userName', 'timestamp', 'view'];
      this.getRequestToPutOnHoldDataByDistrict(this.userId);
    }
    if (this.role === 'GRAMPANCHAYAT') {

      this.displayedColumns = ['fullName', 'place', 'approvalStatus', 'userName', 'timestamp', 'view'];
      this.getRequestToPutOnHoldDataByPanchayat(this.userId);
    }
    if (this.role === 'STATE') {
      this.displayedColumns = ['fullName', 'district', 'place', 'approvalStatus', 'userName', 'timestamp', 'view'];
      this.getRequestToPutOnHoldByState();
      this.getDistrictMasterData();
    }

    if (this.role === 'ADMIN') {
      this.displayedColumns = ['fullName', 'district', 'place', 'approvalStatus', 'userName', 'timestamp', 'view'];
      this.getRequestToPutOnHoldByAdmin();
      this.getDistrictMasterData();
    }

  }


  getRequestToPutOnHoldDataByDistrict(userId) {
    this.spinner.show(undefined,
      {
        type: "square-jelly-box",
        size: "medium",
        color: 'white'
      }
    );
    this.employeeService.getReqToPutOnHoldAtDistrict(userId).subscribe(res => {
      this.putOnHoldData = res;
      let uniquePersonalDetailsData = _.uniqBy(this.putOnHoldData, 'id');
      this.putOnHoldData = uniquePersonalDetailsData;
      this.dataSource = new MatTableDataSource(this.putOnHoldData);
      setTimeout(() => this.dataSource.paginator = this.paginator);
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
    });
  }



  getRequestToPutOnHoldDataByPanchayat(userId) {
    this.spinner.show(undefined,
      {
        type: "square-jelly-box",
        size: "medium",
        color: 'white'
      }
    );
    this.employeeService.getReqToPutOnHoldAtPanchayat(userId).subscribe(res => {
      this.putOnHoldData = res;
      let uniquePersonalDetailsData = _.uniqBy(this.putOnHoldData, 'id');
      this.putOnHoldData = uniquePersonalDetailsData;
      this.dataSource = new MatTableDataSource(this.putOnHoldData);
      setTimeout(() => this.dataSource.paginator = this.paginator);
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
    });
  }

  getRequestToPutOnHoldByState() {
    this.spinner.show(undefined,
      {
        type: "square-jelly-box",
        size: "medium",
        color: 'white'
      }
    );
    this.employeeService.getRequestToPutOnHoldByState().subscribe(res => {
      this.putOnHoldData = res;
      let uniquePersonalDetailsData = _.uniqBy(this.putOnHoldData, 'id');
      this.putOnHoldData = uniquePersonalDetailsData;
      this.dataSource = new MatTableDataSource(this.putOnHoldData);
      setTimeout(() => this.dataSource.paginator = this.paginator);
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
    });
  }

  getRequestToPutOnHoldByAdmin() {
    this.spinner.show(undefined,
      {
        type: "square-jelly-box",
        size: "medium",
        color: 'white'
      }
    );
    this.employeeService.getRequestToPutOnHoldDataByAdminUser().subscribe(res => {
      this.putOnHoldData = res;
      let uniquePersonalDetailsData = _.uniqBy(this.putOnHoldData, 'id');
      this.putOnHoldData = uniquePersonalDetailsData;
      this.dataSource = new MatTableDataSource(this.putOnHoldData);
      setTimeout(() => this.dataSource.paginator = this.paginator);
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
    });
  }


  viewEmployee(employee) {

    this.dialog.open(DialogViewProposalFormComponent, {
      height: '600px',
      width: '1200px',
      data: employee,
      disableClose: true
    });

  }

  applyFilter(filter: string) {
    this.dataSource.filter = filter.trim().toLowerCase();
  }



  selectedPanchyatFromList(panchayat) {
    this.dynamicStateApproved.panchayatName = panchayat.PanchyatId;

  }

  selectedDistrictFromList(district) {
    this.isDistrictSelected = true;
    this.dynamicStateApproved.districtId = district.DistrictId;
    this.spinner.show(undefined,
      {
        type: "square-jelly-box",
        size: "medium",
        color: 'white'
      }
    );
    this.employeeService.getPanchayatBasedOnDistrictId(this.dynamicStateApproved.districtId).subscribe(res => {
      this.panchayatData = res;
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
    });
    this.dynamicStateApproved.panchayatName = '';

  }

  getDistrictMasterData() {
    this.spinner.show(undefined,
      {
        type: "square-jelly-box",
        size: "medium",
        color: 'white'
      }
    );
    this.employeeService.getDistrictMasterData().subscribe(res => {
      this.districtData = res;
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
    });
  }

  searchRecord() {
    this.dynamicStateApproved.roleName = sessionStorage.getItem('role');
    if (this.dynamicStateApproved.districtId === null || this.dynamicStateApproved.districtId === undefined) {
      this.dynamicStateApproved.districtId = 0;
    }
    if (this.dynamicStateApproved.panchayatName === null || this.dynamicStateApproved.panchayatName === undefined || this.dynamicStateApproved.panchayatName === '') {
      this.dynamicStateApproved.panchayatName = 'ALL';

    }
    this.spinner.show(undefined,
      {
        type: "square-jelly-box",
        size: "medium",
        color: 'white'
      }
    );
    this.employeeService.postDynamicReqToPutOnHoldByState(this.dynamicStateApproved).subscribe(res => {

      this.putOnHoldData = res;
      let uniquePersonalDetailsData = _.uniqBy(this.putOnHoldData, 'id');
      this.putOnHoldData = uniquePersonalDetailsData;
      this.dataSource = new MatTableDataSource(this.putOnHoldData);
      setTimeout(() => this.dataSource.paginator = this.paginator);
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
    });
  }

  searchRecordByAdmin() {
    this.dynamicStateApproved.roleName = sessionStorage.getItem('role');
    if (this.dynamicStateApproved.districtId === null || this.dynamicStateApproved.districtId === undefined) {
      this.dynamicStateApproved.districtId = 0;
    }
    if (this.dynamicStateApproved.panchayatName === null || this.dynamicStateApproved.panchayatName === undefined || this.dynamicStateApproved.panchayatName === '') {
      this.dynamicStateApproved.panchayatName = 'ALL';

    }
    this.spinner.show(undefined,
      {
        type: "square-jelly-box",
        size: "medium",
        color: 'white'
      }
    );
    this.employeeService.postDynamicReqToPutOnHoldListByAdmin(this.dynamicStateApproved).subscribe(res => {

      this.putOnHoldData = res;
      let uniquePersonalDetailsData = _.uniqBy(this.putOnHoldData, 'id');
      this.putOnHoldData = uniquePersonalDetailsData;
      this.dataSource = new MatTableDataSource(this.putOnHoldData);
      setTimeout(() => this.dataSource.paginator = this.paginator);
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
    });
  }
}
