<template>
    <div class="news-category">
        <div class="crumbs">
            <el-breadcrumb>
                <el-breadcrumb-item>
                    <i class="el-icon-tickets"></i>
                    新闻管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>
                    新闻分类
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
                <el-table-column prop="id" label="ID" align="center"></el-table-column>
                <el-table-column prop="title" label="新闻分类名称" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
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

            <!--编辑newsCategory图的弹窗-->
            <el-dialog title="编辑"
                       :visible.sync="editVisible"
                       width="35%"
                       :before-close="handleCancle">
                <el-form ref="editForm" :model="editForm" label-width="100px" align="left">
                    <el-form-item label="新闻分类名称">
                        <el-input v-model="editForm.title"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="handleCancle">取消</el-button>
                    <el-button type="primary" @click="handleEdit">确定</el-button>
                </span>
            </el-dialog>

            <!--新增newsCategory图的弹窗-->
            <el-dialog title="新增"
                       :visible.sync="addVisible"
                       width="35%">
                <el-form ref="addForm" :model="addForm" label-width="100px" align="left">
                    <el-form-item label="新闻分类名称">
                        <el-input v-model="addForm.title"></el-input>
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
        name: "newsCategory",
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
                newsList:[], // 存放所有新闻列表
                showLoading: false
            }
        },
        created() {
            this.getList()
        },
        methods: {
            // 获取列表数据
            getList() {
                this.showLoading = true;
                this.axios.get(`/newsCategory/list`)
                    .then(res => {
                        this.tableData = res.data;
                        this.showLoading = false;
                    });
            },
            // 触发编辑轮播图窗口
            toEdit(row) {
                this.editVisible = true;
                this.editForm = row;
            },
            // 弹窗内确认修改，触发
            handleEdit() {
                this.editVisible = false;
                this.axios.put(`/newsCategory/update?id=${this.editForm.id}&title=${this.editForm.title}`)
                .then(() => {
                    this.$message.success("信息修改成功");
                    this.getList();
                }).catch(() => {
                    this.$message.warning("信息修改失败");
                    this.getList();
                });
            },
            // 弹窗内确认新增，触发
            handleAdd() {
                this.addVisible = false;
                this.axios.post(`/newsCategory/add?title=${this.addForm.title}`).then(() => {
                    this.$message.success("新增成功");
                    this.addForm = {};
                    this.getList();
                }).catch(() => {
                    this.$message.warning("新增失败");
                });
            },
            // 触发删除确认窗口
            toDelete(row) {
                this.$confirm("确定要删除吗？", "提示", {
                    type: "waring"
                }).then(() => {
                    this.handleDelete(row);
                });
            },
            // 删除新闻分类
            // TODO 删除新闻分类的时候需要判断该分类下是否有新闻
            handleDelete(row) {
                this.axios.delete(`/newsCategory/del/${row.id}`)
                .then(() => {
                    this.$message.success("删除成功");
                    this.getList();
                });
            },
            // 点击取消按钮
            handleCancle() {
                this.editVisible = false;
                this.getList();
            },
        }
    }
</script>

<style lang="scss">
    .news-category{
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