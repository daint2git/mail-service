<template>
  <v-container class="d-flex align-center justify-center">
    <v-card min-width="720" max-width="720" outlined>
      <h3 class="primary white--text text-left px-4 py-2">New Mail</h3>
      <v-form ref="form" v-model="isValidForm" class="pa-4">
        <email-field v-model="from" label="From" readonly />

        <email-field
          v-model="toInput"
          label="To (*)"
          required
          :rules="toRules"
          @keyup.enter="handleAddEmail('to')"
        />

        <email-tags
          :emails="toList"
          @delete="handleDeleteEmail('to', $event)"
        />

        <email-field
          v-model="ccInput"
          label="Cc"
          :rules="ccRules"
          @keyup.enter="handleAddEmail('cc')"
        />

        <email-tags
          :emails="ccList"
          @delete="handleDeleteEmail('cc', $event)"
        />

        <EmailField
          v-model="bccInput"
          label="Bcc"
          :rules="bccRules"
          @keyup.enter="handleAddEmail('bcc')"
        />

        <email-tags
          :emails="bccList"
          @delete="handleDeleteEmail('bcc', $event)"
        />

        <div class="template-field-group d-flex align-center">
          <v-text-field
            v-if="isCreate"
            v-model="newTemplateName"
            label="New Template Name"
          />
          <v-select
            v-if="!isCreate"
            :value="selectedTemplate.value"
            :items="templates"
            label="Template Name"
            required
            @input="handleChangeTemplate"
          ></v-select>
          <v-icon
            v-if="isCreate"
            class="icon"
            color="primary"
            @click.prevent="handleCreateTemplateClose"
            >mdi-close-circle</v-icon
          >
          <v-icon
            v-if="!isCreate"
            class="icon"
            color="primary"
            @click.prevent="handleCreateTemplateOpen"
            >mdi-plus-circle</v-icon
          >

          <v-icon
            v-if="!isCreate && templates.length > 0"
            class="icon"
            color="primary"
            >mdi-delete-circle</v-icon
          >
        </div>

        <v-text-field
          v-model="subject"
          label="Subject (*)"
          :counter="99"
          :rules="subjectRules"
          required
          class="mb-2"
        />

        <ckeditor
          v-model="body"
          :editor="editor"
          :config="editorConfig"
        ></ckeditor>

        <div class="d-flex align-center justify-space-around mt-6">
          <v-btn large color="primary">
            Save Template
            <v-icon class="icon" dark right>mdi-check-circle</v-icon>
          </v-btn>
          <v-btn
            large
            color="primary"
            :disabled="!isValidForm"
            @click.prevent="handlePreviewMail"
          >
            Preview Mail
            <v-icon class="icon" dark right>mdi-eye-circle</v-icon>
          </v-btn>
          <v-btn
            large
            color="primary"
            :disabled="!isValidForm"
            @click.prevent="handleSendMail"
          >
            Send Mail
            <v-icon class="icon" dark right>mdi-send-circle</v-icon>
          </v-btn>
        </div>
      </v-form>
      <preview-mail-modal
        :is-open.sync="isPreview"
        :mail="mail"
        @send="handleSendMail"
      />
      <sent-mail-success-modal
        :is-open.sync="isSentMailSuccess"
        :mail-detail-sent="mailDetailSent"
      />
      <error-modal :is-open.sync="hasError" />
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import CKEditor from '@ckeditor/ckeditor5-vue';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { namespace } from 'vuex-class';
import EmailField from '../components/EmailField.vue';
import EmailTags from '../components/EmailTags.vue';
import PreviewMailModal from '../components/PreviewMailModal.vue';
import SentMailSuccessModal from '../components/SentMailSuccessModal.vue';
import ErrorModal from '../components/ErrorModal.vue';
import RestService from '../services/RestService';
import { Regex } from '../constants';
import {
  IMail,
  ITemplate,
  ISelectOption,
  IAccount,
  IMailDetailSent,
} from '../types';
import convertArrayToOptions from '../helpers/convertArrayToOptions';
import convertObjectToOption from '../helpers/convertObjectToOption';
import {
  isRequired,
  isRequiredInArray,
  isEmail,
  isUniqueInArray,
} from '../helpers/validate';

const user = namespace('user');

type Rule = (v: null | string) => boolean | string;

const restService = new RestService();

@Component({
  components: {
    ckeditor: CKEditor.component,
    EmailField,
    EmailTags,
    PreviewMailModal,
    SentMailSuccessModal,
    ErrorModal,
  },
})
export default class CreateMail extends Vue {
  isValidForm = false;
  isCreate = false;
  isPreview = false;

  newTemplateName = '';
  selectedTemplate: ITemplate = {
    id: null,
    name: null,
    subject: null,
    body: null,
  };
  templates: (ITemplate & ISelectOption)[] = [];

  from = '';
  toInput = '';
  toList: string[] = [];

  ccInput = '';
  ccList: string[] = [];

  bccInput = '';
  bccList: string[] = [];

  subject = '';

  body = '';

  editor = ClassicEditor;
  editorConfig = {
    toolbar: [
      'heading',
      '|',
      'bold',
      'italic',
      'link',
      'bulletedList',
      'numberedList',
      '|',
      'indent',
      'outdent',
      '|',
      'imageUpload',
      'blockQuote',
      'insertTable',
      'mediaEmbed',
      '|',
      'undo',
      'redo',
    ],
  };

  isSentMailSuccess = false;
  mailDetailSent: IMailDetailSent = {
    message: null,
    data: {
      info: null,
      previewUrl: null,
    },
  };

  hasError = false;

  @user.State
  public account!: IAccount;

  get subjectRules(): Rule[] {
    return [isRequired('Subject')];
  }

  get toRules(): Rule[] {
    return [
      isEmail('To'),
      isRequiredInArray('To', this.toList),
      isUniqueInArray('To', this.toList),
    ];
  }

  get ccRules(): Rule[] {
    return [isEmail('Cc'), isUniqueInArray('Cc', this.ccList)];
  }

  get bccRules(): Rule[] {
    return [isEmail('Bcc'), isUniqueInArray('Bcc', this.bccList)];
  }

  get mail(): IMail {
    return {
      from: this.from,
      to: this.toList.join(', '),
      cc: this.ccList.join(', '),
      bcc: this.bccList.join(', '),
      subject: this.subject,
      body: this.body,
    };
  }

  handleAddEmail(fieldName: 'to' | 'cc' | 'bcc'): void {
    const emailRegex = new RegExp(Regex.EMAIL);

    if (
      // @ts-ignore
      emailRegex.test(this[`${fieldName}Input`]) &&
      // @ts-ignore
      !this[`${fieldName}List`].includes(this[`${fieldName}Input`])
    ) {
      // @ts-ignore
      this[`${fieldName}List`].push(this[`${fieldName}Input`]);
      // @ts-ignore
      this[`${fieldName}Input`] = '';
    }
  }

  handleDeleteEmail(fieldName: 'to' | 'cc' | 'bcc', index: number): void {
    // @ts-ignore
    this[`${fieldName}List`].splice(index, 1);
    // @ts-ignore
    this.$refs.form.validate();
  }

  handleChangeTemplate(templateId: number): void {
    const selectedTemplate = this.templates.find(
      template => template.id === templateId,
    );

    if (selectedTemplate) {
      this.selectedTemplate = selectedTemplate;
      this.subject = this.selectedTemplate?.subject ?? '';
      this.body = this.selectedTemplate?.body ?? '';
    }
  }

  handleCreateTemplateClose(): void {
    this.isCreate = false;
  }

  handleCreateTemplateOpen(): void {
    this.isCreate = true;
  }

  handlePreviewMail(): void {
    this.isPreview = true;
  }

  async handleSendMail(): Promise<void> {
    try {
      const response = await restService.post({
        url: 'mail/send-mail',
        data: {
          config: this.account,
          mail: this.mail,
        },
      });

      if (this.isPreview) this.isPreview = false;

      this.isSentMailSuccess = true;
      this.mailDetailSent = response;
    } catch (error) {
      this.hasError = true;
    }
  }

  async fetchTemplates(): Promise<void> {
    try {
      const response = await restService.get({ url: 'templates' });
      const [firstTemplate] = response.data;

      this.templates = convertArrayToOptions<ITemplate>(response.data);
      this.selectedTemplate = convertObjectToOption(firstTemplate) ?? null;
      this.subject = firstTemplate?.subject ?? '';
      this.body = firstTemplate?.body ?? '';
    } catch (error) {
      this.hasError = true;
    }
  }

  async saveTemplate(): Promise<void> {
    try {
      if (this.isCreate) {
        const response = await restService.post({ url: 'templates' });

        this.templates = this.templates.concat(response.data);
        this.selectedTemplate = response.data;
        this.subject = response.data?.subject;
        this.body = response.data?.body;
        return;
      }

      const { selectedTemplate, subject, body } = this;
      const response = await restService.put({
        url: `templates/${selectedTemplate?.id}`,
        data: { subject, body },
      });

      this.templates = this.templates.map(template =>
        template.id === selectedTemplate?.id
          ? { ...template, subject, body }
          : template,
      );
      this.subject = response.data?.subject;
      this.body = response.data?.body;
    } catch (error) {
      this.hasError = true;
    }
  }

  async deleteTemplate(): Promise<void> {
    try {
      const { selectedTemplate } = this;

      await restService.delete({ url: `templates/${selectedTemplate?.id}` });

      const newTemplates = this.templates.filter(
        template => template.id !== selectedTemplate?.id,
      );
      const [firstTemplate] = newTemplates;

      this.templates = newTemplates;
      this.selectedTemplate = firstTemplate;
      this.subject = firstTemplate?.subject ?? '';
      this.body = firstTemplate?.body ?? '';
    } catch (error) {
      this.hasError = true;
    }
  }

  created(): void {
    this.fetchTemplates();
    if (this.account.user) {
      this.from = this.account.user;
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
}

.icon {
  cursor: pointer;
}

.template-field-group {
  > * {
    margin-left: 8px;

    &:first-child {
      margin-left: 0;
    }
  }
}
</style>

<style lang="scss">
.ck-editor__editable {
  height: 360px;
}
</style>
