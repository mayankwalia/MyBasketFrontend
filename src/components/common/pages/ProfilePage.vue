<template>
    <div class="container">
        <div class="row profile">
            <div class="col-md-3">
                <div class="profile-sidebar">
                    <!-- SIDEBAR USER TITLE -->
                    <div class="profile-usertitle">
                        <div class="profile-usertitle-name">
                            {{ $store.state.user.username }}
                        </div>
                        <div class="profile-usertitle-job">
                            {{ $store.state.user.email }}
                        </div>
                    </div>
                    <!-- END SIDEBAR USER TITLE -->

                    <!-- SIDEBAR BUTTONS -->
                    <div class="profile-userbuttons">
                        <button type="button" class="btn btn-success btn-sm" data-bs-toggle="modal"
                            data-bs-target="#updateProfileModal">Change Password</button>
                        <button type="button" class="btn btn-danger btn-sm" data-bs-toggle="modal" v-if="$store.state.role !== 'admin'"
                            data-bs-target="#deactivateConfirmModal">Deactivate</button>
                    </div>
                    <!-- END SIDEBAR BUTTONS -->

                    <!-- STAT -->
                    <div class="portlet light bordered">
                        <div class="row list-separated profile-stat">
                            <div :class="$store.state.role !== 'customer'?'col-md-8 col-sm-8 col-xs-12':'col-md-12 col-sm-12 col-xs-12'">
                                <div class="uppercase profile-stat-title">{{ formatDateTime($store.state.user.created_at) }}</div>
                                <div class="uppercase profile-stat-text"> Member Since 
                                </div>
                            </div>
                            <div class="col-md-4 col-sm-4 col-xs-12" v-if="$store.state.role !== 'customer'">
                                <div class="uppercase profile-stat-title"> {{ items_sold }} </div>
                                <div class="uppercase profile-stat-text"> Items Sold</div>
                            </div>
                        </div>
                    </div>
                    <!-- END STAT -->
                </div>
            </div>
            <div class="col-md-9">
                <div class="profile-content">
                    <ProfileCard :user="$store.state.user" />
                    <hr />
                    <div v-if="$store.state.role == 'manager'">
                        <label for="export" class="form-label">Export all products data as CSV file.</label>
                        <button class="btn btn-success ms-2" @click="exportData()" >Export
                            data</button>
                    </div>
                    <form v-if="$store.state.role === 'customer'" action="" @submit.prevent="updateReportPreference()">
                        <label for="report_type" class="form-label">Monthly Activity Report Format (This will be emailed at the starting of every month)</label>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="report_type" id="HTML"
                                v-model="reportType" value="HTML">
                            <label class="form-check-label" for="HTML">
                                HTML
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="report_type" id="PDF"
                                v-model="reportType" value="PDF">
                            <label class="form-check-label" for="PDF">
                                PDF
                            </label>
                        </div>
                        <button class="btn btn-outline-success">Save</button>
                    </form>
                    <div class="row m-2">
                        <CardComponent v-for="item, index in items" :title="item.title" :body="item.body" :index="index"
                            :color="item.backgroundColor" :image="item.image" :key="item"></CardComponent>
                    </div>
                </div>

            </div>
        </div>
        <!-- Modal -->
        <div class="modal fade" id="deactivateConfirmModal" tabindex="-1" aria-labelledby="exampleModalLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Are you sure to deactivate your account</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" @click="deactivate()">Save changes</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- Update Profile Modal -->
        <div class="modal fade" id="updateProfileModal" tabindex="-1" aria-labelledby="exampleModalLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Update Profile</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form @submit.prevent="updatePassword()">
                        <div class="modal-body">
                            <div class="mb-3">
                                <label for="inputPassword1" class="form-label">Old Password</label>
                                <input type="password" class="form-control" minlength="6" required v-model="current_password">
                            </div>
                            <div class="mb-3">
                                <label for="inputPassword2" class="form-label">New Password</label>
                                <input type="password" class="form-control" minlength="6" required min="6" v-model="new_password">
                            </div>
                            <div class="mb-3">
                                <label for="inputPassword3" class="form-label">Confirm New Password</label>
                                <input type="password" class="form-control" minlength="6" required min="6" v-model="confirm_password">
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="submit" class="btn btn-primary" data-bs-dismiss="modal">Save changes</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <!-- Update Profile Picture Modal -->
        <div class="modal fade" id="changeProfileModal" tabindex="-1" aria-labelledby="exampleModalLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Update Profile</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form>
                        <div class="modal-body">
                            <div class="mb-3 form-check">
                                <label for="profile-image" class="form-label">Profile Pic:</label>
                                <input type="file" id="profile-image" class="form-control" name="profile_image"
                                    @input="onFileChange"><br><br>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" @click="updatePicture()">Save changes</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ProfileCard from '../ProfileCard.vue';
import CardComponent from '../CardComponent.vue';
import { formatDateTime } from '@/utils';
export default {
    data() {
        return {
            reportType: null,
            current_password: '',
            new_password: '',
            confirm_password: '',
            items_sold: 0,
            items: [
                {
                    title: "Best Safety Standards",
                    body: "Everyday we check temperature of our staff before they start working.",
                    backgroundColor: "#F7A4A4",
                    image: "../../assets/hand-sanitizer.png"
                },
                {
                    title: "No Contact Delivery",
                    body: "Have your order delivered to your doorstep with no contact.",
                    backgroundColor: "#82CD47",
                    image: "../../assets/food-delivery-boy.svg"
                },
                {
                    title: "Regular Warehouse Sanitization",
                    body: "We keep our warehouse sanitized regularly to ensure safety of our staff and customers.",
                    backgroundColor: "#BC7AF9",
                    image: "../../assets/grocery.png"
                },
            ]
        }
    },
    components: {
        ProfileCard,
        CardComponent
    },
    methods: {
        formatDateTime(date) {
            return formatDateTime(date);
        },
        onFileChange(e) {
            const file = e.target.files[0];
            this.user.image = file;
            this.photoURL = URL.createObjectURL(file);
        },
        exportData() {
            this.$privateAxios.get(`export-data/${this.$store.state.user.id}`).then((response) => {
                
                this.$store.dispatch('showMessage', { message: 'Data export started', status: 'success' });
                if (response.status == 200) {
                    const interval = setInterval(() => {
                        this.$privateAxios.get(`/check-export-status/${response.data.taskId}`).then((res) => {
                            console.log(res)
                            if (res.status == 200) {
                                clearInterval(interval);
                                this.$store.dispatch('showMessage', { message: 'CSV download finished', status: 'success' });
                                this.downloadCSV(res.data)
                            }
                        }).catch((err) => {
                            console.log(err);
                            this.$store.dispatch('showMessage', { message: 'Something went wrong', status: 'danger' });
                        })
                    }, 2000)
                }
            }).catch((err) => {
                console.log(err);
                this.$store.dispatch('showMessage', { message: 'Something went wrong', status: 'danger' });
            })
        },
        updateReportPreference() {
            this.$privateAxios.post('/update-report-preference', { reportType: this.reportType }).then((res) => {
                console.log(res)
                this.$store.state.user.report_type = this.reportType;
                this.$store.commit("setUser", this.$store.state.user);
                this.$store.dispatch('showMessage', { message: 'Report preference updated', status: 'success' });
            }).catch((err) => {
                console.log(err);
                this.$store.dispatch('showMessage', { message: 'Something went wrong', status: 'danger' });
            })
        },
        updatePassword() {
            if (this.new_password != this.confirm_password) {
                this.$store.dispatch('showMessage', { message: 'Password does not match', status: 'danger' });
                return;
            }
            this.$privateAxios.put(`/users/${this.$store.state.user.id}`, { old_password: this.current_password, new_password: this.new_password}).then((res) => {
                console.log(res)
                this.$store.dispatch()
                this.$store.dispatch('showMessage', { message: 'Password updated', status: 'success' });
            }).catch((error) => {
                if (error.response && error.response.data && error.response.data.message) {
                    this.$store.dispatch('showMessage', { message: error.response.data.message, status: 'danger' });
                } else {
                    console.log(error);
                    this.$store.dispatch('showMessage', { message: 'Something went wrong', status: 'danger' });
                }
            })
        },
        deactivate() {
            this.$privateAxios.post(`/deactivate/${this.$store.state.user.id}`).then((res) => {
                console.log(res)
                this.$store.dispatch('showMessage',  { message: 'Password updated', status: 'success' });
                this.fetchUsers();
            }).catch(err => {
                console.log(err)
                this.$store.dispatch('showMessage',  { message: 'Password updated', status: 'success' });
            })
        },
        downloadCSV(csvData) {
            // Create a Blob
            var blob = new Blob([csvData], { type: 'text/csv' });

            // Create a download link
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = 'exported_data.csv';

            // Append the link to the body and trigger the click event
            document.body.appendChild(link);
            link.click();

            // Remove the link from the body
            document.body.removeChild(link);
        }
    },
    mounted(){
        if(this.$store.state!=='customer'){
            this.items_sold = localStorage.getItem('totalQuantitiesSold') || 0;
        }
        this.reportType = this.$store.state.user.report_type;
    }
}
</script>

<style scoped>
body {
    background: #F1F3FA;
}

.user {
    display: inline-block;
    width: 150px;
    height: 150px;
    border-radius: 50%;

    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
}

/* Profile container */
.profile {
    margin: 20px 0;
}

/* Profile sidebar */
.profile-sidebar {
    padding: 20px 0 10px 0;
    background: #fff;
}

.profile-userpic img {
    float: none;
    margin: 0 auto;
    width: 50%;
    height: 50%;
    -webkit-border-radius: 50% !important;
    -moz-border-radius: 50% !important;
    border-radius: 50% !important;
}

.profile-usertitle {
    text-align: center;
    margin-top: 20px;
}

.profile-usertitle-name {
    color: #5a7391;
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 7px;
}

.profile-usertitle-job {
    text-transform: uppercase;
    color: #5b9bd1;
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 15px;
}

.profile-userbuttons {
    text-align: center;
    margin-top: 10px;
}

.profile-userbuttons .btn {
    text-transform: uppercase;
    font-size: 11px;
    font-weight: 600;
    padding: 6px 15px;
    margin-right: 5px;
}

.profile-userbuttons .btn:last-child {
    margin-right: 0px;
}

.profile-usermenu {
    margin-top: 30px;
}

.profile-usermenu ul li {
    border-bottom: 1px solid #f0f4f7;
}

.profile-usermenu ul li:last-child {
    border-bottom: none;
}

.profile-usermenu ul li a {
    color: #93a3b5;
    font-size: 14px;
    font-weight: 400;
}

.profile-usermenu ul li a i {
    margin-right: 8px;
    font-size: 14px;
}

.profile-usermenu ul li a:hover {
    background-color: #fafcfd;
    color: #5b9bd1;
}

.profile-usermenu ul li.active {
    border-bottom: none;
}

.profile-usermenu ul li.active a {
    color: #5b9bd1;
    background-color: #f6f9fb;
    border-left: 2px solid #5b9bd1;
    margin-left: -2px;
}

/* Profile Content */
.profile-content {
    padding: 20px;
    background: #fff;
    min-height: 300px;
}























a,
button,
code,
div,
img,
input,
label,
li,
p,
pre,
select,
span,
svg,
table,
td,
textarea,
th,
ul {
    -webkit-border-radius: 0 !important;
    -moz-border-radius: 0 !important;
    border-radius: 0 !important;
}

.dashboard-stat,
.portlet {
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    -ms-border-radius: 4px;
    -o-border-radius: 4px;
}

.portlet {
    margin-top: 0;
    margin-bottom: 25px;
    padding: 0;
    border-radius: 4px;
}

.portlet.bordered {
    border-left: 2px solid #e6e9ec !important;
}

.portlet.light {
    padding: 12px 20px 15px;
    background-color: #fff;
}

.portlet.light.bordered {
    border: 1px solid #e7ecf1 !important;
}

.list-separated {
    margin-top: 10px;
    margin-bottom: 15px;
}

.profile-stat {
    padding-bottom: 20px;
    border-bottom: 1px solid #f0f4f7;
}

.profile-stat-title {
    color: #7f90a4;
    font-size: 16px;
    text-align: center;
}

.uppercase {
    text-transform: uppercase !important;
}

.profile-stat-text {
    color: #5b9bd1;
    font-size: 10px;
    font-weight: 600;
    text-align: center;
}

.profile-desc-title {
    color: #7f90a4;
    font-size: 17px;
    font-weight: 600;
}

.profile-desc-text {
    color: #7e8c9e;
    font-size: 14px;
}

.margin-top-20 {
    margin-top: 20px !important;
}

[class*=" fa-"]:not(.fa-stack),
[class*=" glyphicon-"],
[class*=" icon-"],
[class^=fa-]:not(.fa-stack),
[class^=glyphicon-],
[class^=icon-] {
    display: inline-block;
    line-height: 14px;
    -webkit-font-smoothing: antialiased;
}

.profile-desc-link i {
    width: 22px;
    font-size: 19px;
    color: #abb6c4;
    margin-right: 5px;
}</style>