<template>
    <div class="index-banner">
        <div class="crumbs">
            <el-breadcrumb>
                <el-breadcrumb-item>
                    <i class="el-icon-picture"></i>
                    轮播图管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>
                    首页轮播图
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="mgb20 handle-box">
                <el-button type="primary"
                           icon="el-icon-plus"
                           @click="addVisible = true">增加
                </el-button>
            </div>
            <el-table class="table" ref="multipleTable"
                      border :data="tableData"
                      header-cell-class-name="table-header">
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="title" label="轮播图名称" width="140" align="center"></el-table-column>
                <el-table-column label="轮播图(点击查看大图)" align="center">
                    <template slot-scope="scope">
                        <el-image class="productImg"
                                  :preview-src-list="[scope.row.img]"
                                  :src="scope.row.img">
                            <template slot="placeholder">
                                <img src="../assets/loading-svg/loading-bars.svg" alt="">
                            </template>
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column label="链接课程" width="130" align="center">
<!--                    TODO 将childrenid与productId 对应起来，并获取课程名称-->
                    <template slot-scope="scope">
                        <span v-if="scope.row.childTitle">{{scope.row.childTitle}}</span>
                        <span v-else>暂无</span>
                    </template>
                </el-table-column>
                <el-table-column label="归属" width="100" align="center">
                    <el-tag type="success">首页轮播图</el-tag>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text"
                                   @click="toEdit(scope.row)"
                                   icon="el-icon-edit">编辑
                        </el-button>
                        <el-button type="text"
                                   icon="el-icon-delete"
                                   class="red"
                                   @click="toDelete(scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <loading v-if="showLoading"></loading>

            <!--编辑banner图的弹窗-->
            <el-dialog title="编辑"
                       :visible.sync="editVisible"
                       width="35%"
                       :before-close="handleCancle">
                <el-form ref="editForm" :model="editForm" label-width="100px" align="left">
                    <el-form-item label="轮播图名称">
                        <el-input v-model="editForm.title"></el-input>
                    </el-form-item>
                    <!-- TODO 这里需要为 轮播图赋予超链接的指向，下拉表单中存放课程名称-->
                    <el-form-item label="链接产品">
                        <el-select v-model="editForm.childId">
                            <el-option v-for="item in productList"
                                       :key="item.id" :value="item.id"
                                       :label="item.title">
                            </el-option>
                            <el-option label="在售" value=""></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="轮播图片" class="upload-box">
                        <img v-if="editForm.img" :src="editForm.img" class="upladImg">
                        <el-upload
                                action="/api/upload"
                                list-type="picture-card"
                                :on-preview="imgPreview"
                                :on-success="imgUploadSuccess"
                                :on-remove="handleRemove">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <el-dialog :visible.sync="imgVisible">
                            <img width="100%" :src="editForm.img" alt="">
                        </el-dialog>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="handleCancle">取消</el-button>
                    <el-button type="primary" @click="handleEdit">确定</el-button>
                </span>
            </el-dialog>

            <!--新增banner图的弹窗-->
            <el-dialog title="新增"
                       :visible.sync="addVisible"
                       width="35%">
                <el-form ref="editForm" :model="addForm" label-width="100px" align="left">
                    <el-form-item label="轮播图名称">
                        <el-input v-model="addForm.title"></el-input>
                    </el-form-item>
                    <!-- TODO 这里需要为 轮播图赋予超链接的指向，下拉表单中存放课程名称-->
                    <el-form-item label="链接产品">
                        <el-select v-model="addForm.childId" placeholder="请选择链接的课程">
                            <el-option v-for="item in productList"
                                       :key="item.id" :value="item.id"
                                       :label="item.title">
                            </el-option>
                            <el-option label="在售" value=""></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="轮播图片" class="upload-box">
                        <img v-if="addForm.img" :src="addForm.img" class="upladImg">
                        <el-upload
                                action="/api/upload"
                                list-type="picture-card"
                                :on-preview="imgPreview"
                                :on-success="imgAddSuccess">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <el-dialog :visible.sync="imgVisible">
                            <img width="100%" :src="addForm.img" alt="">
                        </el-dialog>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleAdd">确定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import Loading from "../components/Loading";

    export default {
        name: "IndexBanner",
        components: {
            Loading
        },
        data() {
            return {
                tableData: [], // 存放 渲染table表格的数据
                multipleSelection: [], // ref 指向的双向绑定的对象
                editVisible: false, // 控制编辑信息窗口的显示
                addVisible: false, // 控制添加窗口的显示
                imgVisible:false, // 控制产品简介图窗口的显示
                editForm: {}, // 与编辑窗口中的 表单双向绑定
                addForm: {}, // 与添加窗口中的表单双向绑定
                productList:[], // 存放所有商品列表
                showLoading: false
            }
        },
        async created() {
            await this.getList();
        },
        methods: {
            /*con(e) {
                console.log(e)
            },*/
            // 获取列表数据
            async getList() {
                this.showLoading = true;
                this.productList = await this.getProduct();
                this.axios.get(`/banner/list/10`)
                    .then(res => {
                        this.tableData = this.getTableData(res.data,this.productList);
                        this.showLoading = false;
                    });
            },
            // 获取所有产品信息
            async getProduct() {
                return await this.axios.get("/product/all").then(res => {
                    return res.data;
                });
            },
            // 将产品表中的title 通过 banner表下的childId 提取出来复制到 对应的 banner对象下的childTitle中
            getTableData(tabledata,productList) {
                productList.forEach(product => {
                    tabledata.forEach(banner => {
                        if (product.id == banner.childId) {
                            banner.childTitle = product.title;
                        }
                    });
                });
                return tabledata;
            },


            // 删除上传图片组件中的图片列表
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            // 预览轮播图
            imgPreview() {
                this.imgVisible = true;
            },
            // 轮播图上传成功
            imgUploadSuccess(res) {
                this.editForm.img = this.toFilePath(res);
            },
            // 新增轮播图
            imgAddSuccess(res) {
                this.addForm.img = this.toFilePath(res);
            },

            // 弹窗内确认新增
            handleAdd() {
                this.addVisible = false;
                this.addForm.status = 10;
                this.axios.post(`/banner/add`, this.addForm).then(() => {
                    this.$message.success("轮播图新增成功");
                    this.addForm = {};
                    this.getList();
                }).catch(() => {
                    this.$message.warning("轮播图新增失败");
                });
                this.getList();
            },
            // 触发编辑轮播图窗口
            toEdit(row) {
                this.editVisible = true;
                this.editForm = row;
                console.log(row);
            },
            // 弹窗内确认修改，触发
            handleEdit() {
                this.editVisible = false;
                this.editForm.status = 10;
                this.axios.put(`/banner/update/${this.editForm.id}`, this.editForm).then(() => {
                    this.$message.success("轮播图信息修改成功");
                    this.getList();
                }).catch(() => {
                    this.$message.warning("轮播图信息修改失败");
                });
                this.getList();
            },
            // 商品的删除操作
            toDelete(row) {
                this.$confirm("确定要删除吗？", "提示", {
                    type: "waring"
                }).then(() => {
                    this.handleDelete(row);
                });
            },
            // 删除轮播图
            handleDelete(row) {
                this.axios.delete(`/banner/del/${row.id}`).then(() => {
                    this.$message.success("轮播图删除成功");
                    this.getList();
                }).catch(() => {
                    this.$message.warning("轮播图删除失败");
                });
            },

            // 点击取消按钮
            handleCancle() {
                this.editVisible = false;
                this.getList();
            },
            // 转化 图片路径
            toFilePath(res) {
                let filename = res.data.substring(res.data.lastIndexOf("/")+1);
                return "http://fk.c8xh.com/imgs/" + filename;
            },
        }
    }
</script>

<style lang="scss">
    .index-banner {
        .handle-box {
            text-align: left;

            .handle-input {
                width: 300px;
                display: inline-block;
            }
        }

        .table {
            font-size: 16px !important;

            .red {
                color: #ff0000;
            }

            .detailImg, .productImg {
                display: block;
                margin: auto;
                width: 150px;
                height: 100px;
                border-radius: 5px;
            }
        }

        .avatar-uploader .el-upload {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            width: 190px;
            height: 100px;

            &:hover {
                border-color: #409EFF;
            }

            .avatar-uploader-icon {
                font-size: 28px;
                color: #8c939d;
                width: 178px;
                height: 178px;
                line-height: 178px;
                text-align: center;
            }

            .avatar {
                width: 100%;
                object-fit: contain;
            }
        }
        .upload-box{
            .upladImg{
                width: 100px;
                object-fit: contain;
            }
            .el-form-item__content{
                display: flex;
                height: 100px;
            }
            .el-upload--picture-card{
                width: 100px;
                height: 100px;
                line-height: 100px;
            }
            .el-upload-list--picture-card .el-upload-list__item{
                width: 100px;
                height: 100px;
            }
            .el-upload-list el-upload-list--picture-card{
                width: 100px;
                height: 100px;
                line-height: 100px;
            }
        }
    }
</style>