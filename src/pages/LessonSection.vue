<template>
    <div class="lesson-section">
        <div class="crumbs">
            <el-breadcrumb>
                <el-breadcrumb-item>
                    <i class="el-icon-video-camera-solid"></i>
                    课程视频管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>
                    课程小节
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="mgb20 handle-box">
                <!--TODO 通过课程来筛选 章节列表-->
                <el-tag effect="plain" class="tag-title">课程名称</el-tag>
                <el-select v-model="productId" placeholder="请选择课程" class="mr10">
                    <el-option v-for="item in productList"
                               :key="item.id"
                               :value="item.id"
                               :label="item.title">
                    </el-option>
                </el-select>
                <el-button type="primary"
                           @click="handleSearch"
                           icon="el-icon-search">搜索
                </el-button>
                <el-button type="primary"
                           icon="el-icon-plus"
                           @click="addVisible = true">增加
                </el-button>
            </div>
            <el-table class="table" ref="multipleTable"
                      border :data="tableData"
                      header-cell-class-name="table-header">
                <el-table-column prop="id" width="90" label="ID" align="center"></el-table-column>
                <el-table-column prop="name" width="150" label="课程小节名称" align="center"></el-table-column>
                <el-table-column prop="url" label="视频播放地址"></el-table-column>
                <el-table-column width="150" label="所属章节" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.parentName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120" align="center">
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

            <el-dialog title="编辑"
                       :visible.sync="editVisible"
                       width="35%"
                       :before-close="handleCancle">
                <el-form ref="editForm" :model="editForm" label-width="100px" align="left">
                    <el-form-item label="课程小节名称">
                        <el-input v-model="editForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="视频播放地址">
                        <el-input v-model="editForm.url"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="handleCancle">取消</el-button>
                    <el-button type="primary" @click="handleEdit">确定</el-button>
                </span>
            </el-dialog>

            <el-dialog title="新增"
                       :visible.sync="addVisible"
                       width="35%">
                <el-form ref="addForm" :model="addForm" label-width="100px" align="left">
                    <el-form-item label="课程小节名称">
                        <el-input v-model="addForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="视频播放地址">
                        <el-input v-model="addForm.url"></el-input>
                    </el-form-item>
                    <el-form-item label="所属章节">
                        <el-select v-model="addForm.parentId"
                                   placeholder="请为该小节选择课程大章">
                            <el-option v-for="item in chapterList"
                                       :key="item.id"
                                       :label="item.name"
                                       :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleAdd">确定</el-button>
                </span>
            </el-dialog>
        </div>
        <loading v-if="showLoading"></loading>
    </div>
</template>

<script>
    import Loading from "../components/Loading";

    export default {
        name: "LessonSection",
        components: {
            Loading
        },
        data() {
            return {
                tableData: [], // 存放 渲染table表格的数据
                multipleSelection: [], // ref 指向的双向绑定的对象
                editVisible: false, // 控制编辑信息窗口的显示
                addVisible: false, // 控制添加窗口的显示
                imgVisible: false, // 控制产品简介图窗口的显示
                editForm: {}, // 与编辑窗口中的 表单双向绑定
                addForm: {}, // 与添加窗口中的表单双向绑定
                productList: [], // 存放所有课程
                chapterList: [], // 存放课程大章
                showLoading: false,
                productId: 1, // 课程id
            }
        },
        async created() {
            this.getList();
            await this.getProductList();
        },
        methods: {
            // 获取列表数据
            getList() {
                this.showLoading = true;
                this.tableData = [];
                this.axios.get(`/lesson/list/${this.productId}`)
                    .then(res => {
                        this.getTableData(res.data);
                        this.showLoading = false;
                    })
                    .catch(error => {
                        if (error.status == -1) {
                            this.tableData = null;
                            this.$message.error("该课程下没有章节信息！")
                        }
                        this.showLoading = false;
                    });

            },
            async getProductList() {
                this.productList = await this.axios.get(`/product/all`)
                    .then(res => {
                        return res.data;
                    });
            },
            // 提取课程大章下面的小节数据添加到表格数组中，并根据每个小节的parentId获取大章名称
            getTableData(data) {
                this.chapterList = [];
                data.lessonVoList.forEach(chapter => {
                    this.chapterList.push(chapter);
                    chapter.lessonVoList.forEach(section => {
                        if (section.parentId == chapter.id) {
                            section.parentName = chapter.name
                        }
                        this.tableData.push(section);
                    });
                })
            },
            // 查询其他课程
            handleSearch() {
                this.getList();
            },

            // 触发编辑窗口
            toEdit(row) {
                this.editVisible = true;
                this.editForm = row;
            },
            // 弹窗内确认修改，触发
            handleEdit() {
                this.editVisible = false;
                this.axios.put(`/lesson/update?id=${this.editForm.id}&name=${this.editForm.name}&url=${this.editForm.url}`)
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
                this.axios.post(`/lesson/addSection`, this.addForm)
                    .then(() => {
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
                this.axios.delete(`/lesson/del/${row.id}`)
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
    .lesson-section {
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

        .upload-box {
            .upladImg {
                width: 100px;
                object-fit: contain;
            }

            .el-form-item__content {
                display: flex;
                height: 100px;
            }

            .el-upload--picture-card {
                width: 100px;
                height: 100px;
                line-height: 100px;
            }

            .el-upload-list--picture-card .el-upload-list__item {
                width: 100px;
                height: 100px;
            }

            .el-upload-list el-upload-list--picture-card {
                width: 100px;
                height: 100px;
                line-height: 100px;
            }
        }
    }
</style>