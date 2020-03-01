<template>
    <div class="product">
        <!--头部面包屑-->
        <div class="crumbs">
            <el-breadcrumb>
                <el-breadcrumb-item>
                    <i class="el-icon-s-shop"></i>
                    产品管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="mgb20 handle-box">
                <el-input class="handle-input mr10"
                          v-model="query.name"
                          @keyup.enter.native="handleSearch"
                          placeholder="搜索课程名称"></el-input>
                <el-button type="primary"
                           @click="handleSearch"
                           icon="el-icon-search">搜索
                </el-button>
                <el-button type="primary"
                           icon="el-icon-plus"
                           @click="toAdd">增加
                </el-button>
            </div>
            <el-table class="table" ref="multipleTable"
                      border :data="tableData"
                      header-cell-class-name="table-header">
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="title" label="课程名称" width="140" align="center"></el-table-column>
                <el-table-column label="课程价格" width="140" align="center">
                    <template slot-scope="scope">
                        ￥{{scope.row.price}}
                    </template>
                </el-table-column>
                <el-table-column label="课程简介图(点击查看大图)" align="center">
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
                <el-table-column label="课程详情图(点击查看大图)" align="center">
                    <template slot-scope="scope">
                        <el-image class="detailImg"
                                  fit="contain"
                                  :preview-src-list="[scope.row.subImg]"
                                  :src="scope.row.subImg">
                            <template slot="placeholder">
                                <img src="../assets/loading-svg/loading-bars.svg" alt="">
                            </template>
                        </el-image>
                    </template>
                </el-table-column>
                <!--                TODO 加载课程列表的时候，status为3的数据不进行渲染-->
                <el-table-column label="课程状态" width="100" align="center">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.status==1">在售</el-tag>
                        <el-tag type="danger" v-if="scope.row.status==2">下架</el-tag>
                    </template>
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
            <!--            分页器-->
            <div class="pagination">
                <el-pagination backgorund
                               :page-size="query.pageSize"
                               :total="pageTotal"
                               @current-change="handlePageChange"
                               layout="prev,pager,next,jumper">
                </el-pagination>
            </div>

            <!--编辑商品信息的弹窗-->
            <el-dialog title="编辑"
                       :visible.sync="editVisible"
                       width="35%"
                       :before-close="handleCancle">
                <el-form ref="editForm" :model="editForm" label-width="100px" align="left">
                    <el-form-item label="课程名称">
                        <el-input v-model="editForm.title"></el-input>
                    </el-form-item>
                    <el-form-item label="课程价格">
                        <el-input v-model="editForm.price"></el-input>
                    </el-form-item>
                    <el-form-item label="课程状态">
                        <el-select v-model="editForm.status">
                            <el-option label="在售" value="1"></el-option>
                            <el-option label="下架" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="课程简介图" class="upload-box">
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
                    <el-form-item label="课程详情图" class="upload-box">
                        <img v-if="editForm.subImg" :src="editForm.subImg" class="upladImg">
                        <el-upload
                                action="/api/upload"
                                list-type="picture-card"
                                :on-preview="subImgPreview"
                                :on-success="subImgUploadSuccess"
                                :on-remove="handleRemove">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <el-dialog :visible.sync="subImgVisible">
                            <img width="100%" :src="editForm.subImg" alt="">
                        </el-dialog>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="handleCancle">取消</el-button>
                    <el-button type="primary" @click="handleEdit">确定</el-button>
                </span>
            </el-dialog>

            <!--新增商品信息的弹窗-->
            <el-dialog title="新增"
                       :visible.sync="addVisible"
                       width="35%">
                <el-form ref="editForm" :model="addForm" label-width="100px" align="left">
                    <el-form-item label="课程名称">
                        <el-input v-model="addForm.title"></el-input>
                    </el-form-item>
                    <el-form-item label="课程价格">
                        <el-input v-model="addForm.price"></el-input>
                    </el-form-item>
                    <el-form-item label="课程简介图" class="upload-box">
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
                    <el-form-item label="课程详情图" class="upload-box">
                        <img v-if="addForm.subImg" :src="addForm.subImg" class="upladImg">
                        <el-upload
                                action="/api/upload"
                                list-type="picture-card"
                                :on-preview="subImgPreview"
                                :on-success="subImgAddSuccess">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <el-dialog :visible.sync="subImgVisible">
                            <img width="100%" :src="addForm.subImg" alt="">
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
        name: "product",
        components: {
            Loading
        },
        data() {
            return {
                query: {
                    name: "", // 模糊查询的名称
                    pageNum: 1,
                    pageSize: 8
                },
                tableData: [], // 存放 渲染table表格的数据
                multipleSelection: [], // ref 指向的双向绑定的对象
                pageTotal: 0, // 列表信息总条数
                editVisible: false, // 控制编辑信息窗口的显示
                addVisible: false, // 控制添加窗口的显示
                imgVisible:false, // 控制产品简介图窗口的显示
                subImgVisible:false, // 控制产品详情图窗口的显示
                editForm: {}, // 与编辑窗口中的 表单双向绑定
                addForm: {}, // 与添加窗口中的表单双向绑定
                showLoading: false
            }
        },
        created() {
            this.getList();
        },
        methods: {
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            // 预览产品简介图
            imgPreview() {
                this.imgVisible = true;
            },
            // 预览产品详情图
            subImgPreview() {
                this.subImgVisible = true;
            },
            // 产品简介图上传成功
            imgUploadSuccess(res) {
                this.editForm.img = this.toFilePath(res);
            },
            // 产品详情图上传成功
            subImgUploadSuccess(res) {
                this.editForm.subImg = this.toFilePath(res);
            },
            // 新增产品简介图
            imgAddSuccess(res) {
                this.addForm.img = this.toFilePath(res);
            },
            // 新增产品详情图
            subImgAddSuccess(res) {
                this.addForm.subImg = this.toFilePath(res);
            },

            // 模糊查询，搜索功能
            handleSearch() {
                this.getList();
            },
            // 触发新增商品弹窗
            toAdd() {
                this.addVisible = true;
            },
            // 弹窗内确认新增，触发
            handleAdd() {
                this.addVisible = false;
                this.axios.post(`/product`, this.addForm).then(() => {
                    this.$message.success("商品新增成功");
                    this.addForm = {};
                    this.getList();
                }).catch(() => {
                    this.$message.warning("商品新增失败");
                });
                this.getList();
            },
            // 触发编辑商品弹窗
            toEdit(row) {
                this.editVisible = true;
                this.editForm = row;
                this.editForm.status = row.status == 1 ? "在售" : "下架";
            },
            // 弹窗内确认修改，触发
            handleEdit() {
                this.editVisible = false;
                this.axios.put(`/product/update/${this.editForm.id}`, this.editForm).then(() => {
                    this.$message.success("课程信息修改成功");
                    this.getList();
                }).catch(() => {
                    this.$message.warning("课程信息修改失败");
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
            // 删除商品
            handleDelete(row) {
                this.axios.delete(`/product/del/${row.id}`).then(() => {
                    this.$message.success("课程删除成功");
                    this.getList();
                }).catch(() => {
                    this.$message.warning("课程删除失败");
                });
            },
            //  分页器中页码切换时触发
            handlePageChange(pageNum) {
                this.query.pageNum = pageNum;
                this.getList();
            },
            // 获取列表数据
            getList() {
                this.showLoading = true;
                this.axios.get(`/product/list`,{
                    params:{
                        title: this.query.name,
                        pageNum: this.query.pageNum,
                        pageSize: this.query.pageSize,
                    }
                }).then(res => {
                    this.tableData = res.data.list.filter(item => {
                        return item.status < 3;
                    });
                    this.pageTotal = res.data.total;
                    this.showLoading = false;
                });
            },
            // 点击取消按钮
            handleCancle() {
                this.editVisible = false;
                this.getList();
            },
            // 转化 图片路径
            toFilePath(res) {
                console.log(res);
                let urlArr = res.data.split("\\");
                let filename = urlArr.pop();
                let filePath = "/imgs/"+filename;
                console.log(filePath);
                return filePath;
            }
        }
    }
</script>

<style lang="scss">
    .product {
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