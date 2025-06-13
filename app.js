// PDF to HTML Value Updater Application
class PDFHTMLUpdater {
    constructor() {
        this.extractedValues = [];
        this.updatedHTML = '';
        this.htmlTemplate = '';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadHTMLTemplate();
        
        // Configure PDF.js worker
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }

    setupEventListeners() {
        const pdfFile = document.getElementById('pdfFile');
        const uploadSection = document.getElementById('uploadSection');

        // File input change
        pdfFile.addEventListener('change', (e) => {
            this.handleFileSelect(e.target.files[0]);
        });

        // Drag and drop
        uploadSection.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadSection.classList.add('dragover');
        });

        uploadSection.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadSection.classList.remove('dragover');
        });

        uploadSection.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadSection.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0 && files[0].type === 'application/pdf') {
                this.handleFileSelect(files[0]);
            } else {
                this.showStatus('Please drop a valid PDF file.', 'error');
            }
        });
    }

    handleFileSelect(file) {
        if (!file) return;

        if (file.type !== 'application/pdf') {
            this.showStatus('Please select a valid PDF file.', 'error');
            return;
        }

        document.getElementById('fileName').textContent = file.name;
        document.getElementById('fileInfo').style.display = 'block';
        document.getElementById('processBtn').disabled = false;
        
        this.selectedFile = file;
        this.showStatus('PDF file selected successfully. Click "Process PDF" to extract values.', 'success');
    }

    async loadHTMLTemplate() {
        // Load the existing HTML template from the current page's template
        // In a real scenario, you might load this from a separate file
        this.htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FORM GSTR-1</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        table, th, td {
            border: 1px solid #ddd;
        }
        th, td {
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        .section-header {
            font-weight: bold;
            margin-top: 20px;
            margin-bottom: 10px;
        }
        .footer {
            margin-top: 30px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 id="form_title">FORM GSTR-1</h1>
        <p id="form_subtitle">[See rule 59(1)]</p>
        <h2 id="form_description">Details of outward supplies of goods or services</h2>
    </div>

    <table>
        <tr>
            <td id="field_financial_year">Financial year</td>
            <td id="value_financial_year">2022-23</td>
        </tr>
        <tr>
            <td id="field_tax_period">Tax period</td>
            <td id="value_tax_period">December</td>
        </tr>
    </table>

    <table>
        <tr>
            <td id="field_1_gstin">1</td>
            <td id="field_1_gstin_label">GSTIN</td>
            <td id="value_1_gstin">27AABCT3664R1ZN</td>
        </tr>
        <tr>
            <td id="field_2a_legal_name">2(a)</td>
            <td id="field_2a_legal_name_label">Legal name of the registered person</td>
            <td id="value_2a_legal_name">TIGER LOGISTICS INDIA LIMITED</td>
        </tr>
        <tr>
            <td id="field_2b_trade_name">2(b)</td>
            <td id="field_2b_trade_name_label">Trade name if any</td>
            <td id="value_2b_trade_name">TIGER LOGISTICS INDIA LIMITED</td>
        </tr>
        <tr>
            <td id="field_2c_arn">2(c)</td>
            <td id="field_2c_arn_label">ARN</td>
            <td id="value_2c_arn">AB271222083451F</td>
        </tr>
        <tr>
            <td id="field_2d_arn_date">2(d)</td>
            <td id="field_2d_arn_date_label">ARN date</td>
            <td id="value_2d_arn_date">11/01/2023</td>
        </tr>
    </table>

    <!-- Section 4A -->
    <div id="section_4a" class="section-header">4A - Taxable outward supplies made to registered persons (other than reverse charge supplies) including supplies made through e-commerce operator attracting TCS - B2B Regular</div>
    <table>
        <tr>
            <th>Description</th>
            <th>No. of records</th>
            <th>Document Type</th>
            <th>Value (₹)</th>
            <th>Integrated Tax (₹)</th>
            <th>Central Tax (₹)</th>
            <th>State/UT Tax (₹)</th>
            <th>Cess (₹)</th>
        </tr>
        <tr>
            <td id="field_4a_description">Total</td>
            <td id="value_4a_records">317</td>
            <td id="value_4a_document_type">Invoice</td>
            <td id="value_4a_value">1,09,47,530.51</td>
            <td id="value_4a_integrated_tax">4,45,823.08</td>
            <td id="value_4a_central_tax">5,76,265.37</td>
            <td id="value_4a_state_tax">5,76,265.37</td>
            <td id="value_4a_cess">0.00</td>
        </tr>
    </table>

    <!-- Section 4B -->
    <div id="section_4b" class="section-header">4B - Taxable outward supplies made to registered persons attracting tax on reverse charge - B2B Reverse charge</div>
    <table>
        <tr>
            <th>Description</th>
            <th>No. of records</th>
            <th>Document Type</th>
            <th>Value (₹)</th>
            <th>Integrated Tax (₹)</th>
            <th>Central Tax (₹)</th>
            <th>State/UT Tax (₹)</th>
            <th>Cess (₹)</th>
        </tr>
        <tr>
            <td id="field_4b_description">Total</td>
            <td id="value_4b_records">0</td>
            <td id="value_4b_document_type">Invoice</td>
            <td id="value_4b_value">0.00</td>
            <td id="value_4b_integrated_tax">0.00</td>
            <td id="value_4b_central_tax">0.00</td>
            <td id="value_4b_state_tax">0.00</td>
            <td id="value_4b_cess">0.00</td>
        </tr>
    </table>

    <!-- Section 5 -->
    <div id="section_5" class="section-header">5 - Taxable outward inter-state supplies made to unregistered persons (where invoice value is more than Rs.2.5 lakh) including supplies made through e-commerce operator, rate wise - B2CL (Large)</div>
    <table>
        <tr>
            <th>Description</th>
            <th>No. of records</th>
            <th>Document Type</th>
            <th>Value (₹)</th>
            <th>Integrated Tax (₹)</th>
            <th>Central Tax (₹)</th>
        </tr>
        <tr>
            <td id="field_5_description">Total</td>
            <td id="value_5_records">0</td>
            <td id="value_5_document_type">Invoice</td>
            <td id="value_5_value">0.00</td>
            <td id="value_5_integrated_tax">0.00</td>
            <td id="value_5_central_tax">0.00</td>
        </tr>
    </table>

    <!-- Section 6A -->
    <div id="section_6a" class="section-header">6A – Exports (with/without payment)</div>
    <table>
        <tr>
            <th>Description</th>
            <th>No. of records</th>
            <th>Document Type</th>
            <th>Value (₹)</th>
            <th>Integrated Tax (₹)</th>
            <th>Central Tax (₹)</th>
        </tr>
        <tr>
            <td id="field_6a_description">Total</td>
            <td id="value_6a_records">155</td>
            <td id="value_6a_document_type">Invoice</td>
            <td id="value_6a_value">6,81,19,151.70</td>
            <td id="value_6a_integrated_tax">0.00</td>
            <td id="value_6a_central_tax">0.00</td>
        </tr>
        <tr>
            <td id="field_6a_expwp">-  EXPWP</td>
            <td id="value_6a_expwp_records">0</td>
            <td id="value_6a_expwp_document_type">Invoice</td>
            <td id="value_6a_expwp_value">0.00</td>
            <td id="value_6a_expwp_integrated_tax">0.00</td>
            <td id="value_6a_expwp_central_tax">0.00</td>
        </tr>
        <tr>
            <td id="field_6a_expwop">-  EXPWOP</td>
            <td id="value_6a_expwop_records">155</td>
            <td id="value_6a_expwop_document_type">Invoice</td>
            <td id="value_6a_expwop_value">6,81,19,151.70</td>
            <td colspan="2"></td>
        </tr>
    </table>

    <!-- Section 6B -->
    <div id="section_6b" class="section-header">6B - Supplies made to SEZ unit or SEZ developer - SEZWP/SEZWOP</div>
    <table>
        <tr>
            <th>Description</th>
            <th>No. of records</th>
            <th>Document Type</th>
            <th>Value (₹)</th>
            <th>Integrated Tax (₹)</th>
            <th>Central Tax (₹)</th>
        </tr>
        <tr>
            <td id="field_6b_description">Total</td>
            <td id="value_6b_records">1</td>
            <td id="value_6b_document_type">Invoice</td>
            <td id="value_6b_value">19,251.60</td>
            <td id="value_6b_integrated_tax">0.00</td>
            <td id="value_6b_central_tax">0.00</td>
        </tr>
        <tr>
            <td id="field_6b_sezwp">-  SEZWP</td>
            <td id="value_6b_sezwp_records">0</td>
            <td id="value_6b_sezwp_document_type">Invoice</td>
            <td id="value_6b_sezwp_value">0.00</td>
            <td id="value_6b_sezwp_integrated_tax">0.00</td>
            <td id="value_6b_sezwp_central_tax">0.00</td>
        </tr>
        <tr>
            <td id="field_6b_sezwop">-  SEZWOP</td>
            <td id="value_6b_sezwop_records">1</td>
            <td id="value_6b_sezwop_document_type">Invoice</td>
            <td id="value_6b_sezwop_value">19,251.60</td>
            <td colspan="2"></td>
        </tr>
    </table>

    <!-- Section 6C -->
    <div id="section_6c" class="section-header">6C - Deemed Exports – DE</div>
    <table>
        <tr>
            <th>Description</th>
            <th>No. of records</th>
            <th>Document Type</th>
            <th>Value (₹)</th>
            <th>Integrated Tax (₹)</th>
            <th>Central Tax (₹)</th>
            <th>State/UT Tax (₹)</th>
            <th>Cess (₹)</th>
        </tr>
        <tr>
            <td id="field_6c_description">Total</td>
            <td id="value_6c_records">0</td>
            <td id="value_6c_document_type">Invoice</td>
            <td id="value_6c_value">0.00</td>
            <td id="value_6c_integrated_tax">0.00</td>
            <td id="value_6c_central_tax">0.00</td>
            <td id="value_6c_state_tax">0.00</td>
            <td id="value_6c_cess">0.00</td>
        </tr>
    </table>

    <!-- Section 7 -->
    <div id="section_7" class="section-header">7 - Taxable supplies (Net of debit and credit notes) to unregistered persons (other than the supplies covered in Table 5) including supplies made through e-commerce operator attracting TCS - B2CS (Others)</div>
    <div id="final_marker">FINAL</div>
    <table>
        <tr>
            <th>Description</th>
            <th>No. of records</th>
            <th>Document Type</th>
            <th>Value (₹)</th>
            <th>Integrated Tax (₹)</th>
            <th>Central Tax (₹)</th>
            <th>State/UT Tax (₹)</th>
            <th>Cess (₹)</th>
        </tr>
        <tr>
            <td id="field_7_description">Total</td>
            <td id="value_7_records">0</td>
            <td id="value_7_document_type">Net Value</td>
            <td id="value_7_value">0.00</td>
            <td id="value_7_integrated_tax">0.00</td>
            <td id="value_7_central_tax">0.00</td>
            <td id="value_7_state_tax">0.00</td>
            <td id="value_7_cess">0.00</td>
        </tr>
    </table>

    <!-- Section 8 -->
    <div id="section_8" class="section-header">8 - Nil rated, exempted and non GST outward supplies</div>
    <table>
        <tr>
            <th>Description</th>
            <th>Value (₹)</th>
        </tr>
        <tr>
            <td id="field_8_total">Total</td>
            <td id="value_8_total">-5,14,071.00</td>
        </tr>
        <tr>
            <td id="field_8_nil">-  Nil</td>
            <td id="value_8_nil">0.00</td>
        </tr>
        <tr>
            <td id="field_8_exempted">-  Exempted</td>
            <td id="value_8_exempted">-5,14,071.00</td>
        </tr>
        <tr>
            <td id="field_8_non_gst">-  Non-GST</td>
            <td id="value_8_non_gst">0.00</td>
        </tr>
    </table>

    <!-- Section 9A - B2B Regular -->
    <div id="section_9a_b2b_regular" class="section-header">9A - Amendment to taxable outward supplies made to registered person in returns of earlier tax periods in table 4 - B2B Regular</div>
    <table>
        <tr>
            <th>Description</th>
            <th>No. of records</th>
            <th>Document Type</th>
            <th>Value (₹)</th>
            <th>Integrated Tax (₹)</th>
            <th>Central Tax (₹)</th>
            <th>State/UT Tax (₹)</th>
            <th>Cess (₹)</th>
        </tr>
        <tr>
            <td id="field_9a_b2b_regular_amended">Amended amount - Total</td>
            <td id="value_9a_b2b_regular_amended_records">0</td>
            <td id="value_9a_b2b_regular_amended_document_type">Invoice</td>
            <td id="value_9a_b2b_regular_amended_value">0.00</td>
            <td id="value_9a_b2b_regular_amended_integrated_tax">0.00</td>
            <td id="value_9a_b2b_regular_amended_central_tax">0.00</td>
            <td id="value_9a_b2b_regular_amended_state_tax">0.00</td>
            <td id="value_9a_b2b_regular_amended_cess">0.00</td>
        </tr>
        <tr>
            <td id="field_9a_b2b_regular_net">Net differential amount (Amended - Original)</td>
            <td colspan="2"></td>
            <td id="value_9a_b2b_regular_net_value">0.00</td>
            <td id="value_9a_b2b_regular_net_integrated_tax">0.00</td>
            <td id="value_9a_b2b_regular_net_central_tax">0.00</td>
            <td id="value_9a_b2b_regular_net_state_tax">0.00</td>
            <td id="value_9a_b2b_regular_net_cess">0.00</td>
        </tr>
    </table>

    <!-- Section 9A - B2B Reverse charge -->
    <div id="section_9a_b2b_reverse" class="section-header">9A - Amendment to taxable outward supplies made to registered person in returns of earlier tax periods in table 4 - B2B Reverse charge</div>
    <table>
        <tr>
            <th>Description</th>
            <th>No. of records</th>
            <th>Document Type</th>
            <th>Value (₹)</th>
            <th>Integrated Tax (₹)</th>
            <th>Central Tax (₹)</th>
            <th>State/UT Tax (₹)</th>
            <th>Cess (₹)</th>
        </tr>
        <tr>
            <td id="field_9a_b2b_reverse_amended">Amended amount - Total</td>
            <td id="value_9a_b2b_reverse_amended_records">0</td>
            <td id="value_9a_b2b_reverse_amended_document_type">Invoice</td>
            <td id="value_9a_b2b_reverse_amended_value">0.00</td>
            <td id="value_9a_b2b_reverse_amended_integrated_tax">0.00</td>
            <td id="value_9a_b2b_reverse_amended_central_tax">0.00</td>
            <td id="value_9a_b2b_reverse_amended_state_tax">0.00</td>
            <td id="value_9a_b2b_reverse_amended_cess">0.00</td>
        </tr>
        <tr>
            <td id="field_9a_b2b_reverse_net">Net differential amount (Amended - Original)</td>
            <td colspan="2"></td>
            <td id="value_9a_b2b_reverse_net_value">0.00</td>
            <td id="value_9a_b2b_reverse_net_integrated_tax">0.00</td>
            <td id="value_9a_b2b_reverse_net_central_tax">0.00</td>
            <td id="value_9a_b2b_reverse_net_state_tax">0.00</td>
            <td id="value_9a_b2b_reverse_net_cess">0.00</td>
        </tr>
    </table>

    <!-- Section 9A - B2CL -->
    <div id="section_9a_b2cl" class="section-header">9A - Amendment to Inter-State supplies made to unregistered person (where invoice value is more than Rs.2.5 lakh) in returns of earlier tax periods in table 5 - B2CL (Large)</div>
    <table>
        <tr>
            <th>Description</th>
            <th>No. of records</th>
            <th>Document Type</th>
            <th>Value (₹)</th>
            <th>Integrated Tax (₹)</th>
            <th>Central Tax (₹)</th>
        </tr>
        <tr>
            <td id="field_9a_b2cl_amended">Amended amount - Total</td>
            <td id="value_9a_b2cl_amended_records">0</td>
            <td id="value_9a_b2cl_amended_document_type">Invoice</td>
            <td id="value_9a_b2cl_amended_value">0.00</td>
            <td id="value_9a_b2cl_amended_integrated_tax">0.00</td>
            <td id="value_9a_b2cl_amended_central_tax">0.00</td>
        </tr>
        <tr>
            <td id="field_9a_b2cl_net">Net differential amount (Amended - Original)</td>
            <td colspan="2"></td>
            <td id="value_9a_b2cl_net_value">0.00</td>
            <td id="value_9a_b2cl_net_integrated_tax">0.00</td>
            <td id="value_9a_b2cl_net_central_tax">0.00</td>
        </tr>
    </table>

    <!-- Section 9A - Export -->
    <div id="section_9a_export" class="section-header">9A - Amendment to Export supplies in returns of earlier tax periods in table 6A (EXPWP/EXPWOP)</div>
    <table>
        <tr>
            <th>Description</th>
            <th>No. of records</th>
            <th>Document Type</th>
            <th>Value (₹)</th>
            <th>Integrated Tax (₹)</th>
            <th>Central Tax (₹)</th>
        </tr>
        <tr>
            <td id="field_9a_export_amended">Amended amount - Total</td>
            <td id="value_9a_export_amended_records">0</td>
            <td id="value_9a_export_amended_document_type">Invoice</td>
            <td id="value_9a_export_amended_value">0.00</td>
            <td id="value_9a_export_amended_integrated_tax">0.00</td>
            <td id="value_9a_export_amended_central_tax">0.00</td>
        </tr>
        <tr>
            <td id="field_9a_export_net">Net differential amount (Amended - Original) - Total</td>
            <td colspan="2"></td>
            <td id="value_9a_export_net_value">0.00</td>
            <td id="value_9a_export_net_integrated_tax">0.00</td>
            <td id="value_9a_export_net_central_tax">0.00</td>
        </tr>
        <tr>
            <td id="field_9a_export_expwp">-  EXPWP</td>
            <td id="value_9a_export_expwp_records">0</td>
            <td id="value_9a_export_expwp_document_type">Invoice</td>
            <td id="value_9a_export_expwp_value">0.00</td>
            <td id="value_9a_export_expwp_integrated_tax">0.00</td>
            <td id="value_9a_export_expwp_central_tax">0.00</td>
        </tr>
        <tr>
            <td id="field_9a_export_expwop">-  EXPWOP</td>
            <td id="value_9a_export_expwop_records">0</td>
            <td id="value_9a_export_expwop_document_type">Invoice</td>
            <td id="value_9a_export_expwop_value">0.00</td>
            <td colspan="2"></td>
        </tr>
    </table>

    <!-- Section 9A - SEZ -->
    <div id="section_9a_sez" class="section-header">9A - Amendment to supplies made to SEZ units or SEZ developers in returns of earlier tax periods in table 6B (SEZWP/SEZWOP)</div>
    <table>
        <tr>
            <th>Description</th>
            <th>No. of records</th>
            <th>Document Type</th>
            <th>Value (₹)</th>
            <th>Integrated Tax (₹)</th>
            <th>Central Tax (₹)</th>
        </tr>
        <tr>
            <td id="field_9a_sez_amended">Amended amount - Total</td>
            <td id="value_9a_sez_amended_records">0</td>
            <td id="value_9a_sez_amended_document_type">Invoice</td>
            <td id="value_9a_sez_amended_value">0.00</td>
            <td id="value_9a_sez_amended_integrated_tax">0.00</td>
            <td id="value_9a_sez_amended_central_tax">0.00</td>
        </tr>
        <tr>
            <td id="field_9a_sez_net">Net differential amount (Amended - Original) - Total</td>
            <td colspan="2"></td>
            <td id="value_9a_sez_net_value">0.00</td>
            <td id="value_9a_sez_net_integrated_tax">0.00</td>
            <td id="value_9a_sez_net_central_tax">0.00</td>
        </tr>
        <tr>
            <td id="field_9a_sez_sezwp">-  SEZWP</td>
            <td id="value_9a_sez_sezwp_records">0</td>
            <td id="value_9a_sez_sezwp_document_type">Invoice</td>
            <td id="value_9a_sez_sezwp_value">0.00</td>
            <td id="value_9a_sez_sezwp_integrated_tax">0.00</td>
            <td id="value_9a_sez_sezwp_central_tax">0.00</td>
        </tr>
        <tr>
            <td id="field_9a_sez_sezwop">-  SEZWOP</td>
            <td id="value_9a_sez_sezwop_records">0</td>
            <td id="value_9a_sez_sezwop_document_type">Invoice</td>
            <td id="value_9a_sez_sezwop_value">0.00</td>
            <td colspan="2"></td>
        </tr>
    </table>

    <!-- Section 9A - Deemed Exports -->
    <div id="section_9a_de" class="section-header">9A - Amendment to Deemed Exports in returns of earlier tax periods in table 6C (DE)</div>
    <table>
        <tr>
            <th>Description</th>
            <th>No. of records</th>
            <th>Document Type</th>
            <th>Value (₹)</th>
            <th>Integrated Tax (₹)</th>
            <th>Central Tax (₹)</th>
            <th>State/UT Tax (₹)</th>
            <th>Cess (₹)</th>
        </tr>
        <tr>
            <td id="field_9a_de_amended">Amended amount - Total</td>
            <td id="value_9a_de_amended_records">0</td>
            <td id="value_9a_de_amended_document_type">Invoice</td>
            <td id="value_9a_de_amended_value">0.00</td>
            <td id="value_9a_de_amended_integrated_tax">0.00</td>
            <td id="value_9a_de_amended_central_tax">0.00</td>
            <td id="value_9a_de_amended_state_tax">0.00</td>
            <td id="value_9a_de_amended_cess">0.00</td>
        </tr>
        <tr>
            <td id="field_9a_de_net">Net differential amount (Amended - Original)</td>
            <td colspan="2"></td>
            <td id="value_9a_de_net_value">0.00</td>
            <td id="value_9a_de_net_integrated_tax">0.00</td>
            <td id="value_9a_de_net_central_tax">0.00</td>
            <td id="value_9a_de_net_state_tax">0.00</td>
            <td id="value_9a_de_net_cess">0.00</td>
        </tr>
    </table>

    <!-- Section 9B - CDNR -->
    <div id="section_9b_cdnr" class="section-header">9B - Credit/Debit Notes (Registered) – CDNR</div>
    <div id="final_marker_2">FINAL</div>
    <table>
        <tr>
            <th>Description</th>
            <th>No. of records</th>
            <th>Document Type</th>
            <th>Value (₹)</th>
            <th>Integrated Tax (₹)</th>
            <th>Central Tax (₹)</th>
            <th>State/UT Tax (₹)</th>
            <th>Cess (₹)</th>
        </tr>
        <tr>
            <td id="field_9b_cdnr_total">Total - Net off debit/credit notes (Debit notes - Credit notes)</td>
            <td id="value_9b_cdnr_total_records">9</td>
            <td id="value_9b_cdnr_total_document_type">Note</td>
            <td id="value_9b_cdnr_total_value">-8,26,005.35</td>
            <td id="value_9b_cdnr_total_integrated_tax">-1,32,446.22</td>
            <td id="value_9b_cdnr_total_central_tax">-4,179.73</td>
            <td id="value_9b_cdnr_total_state_tax">-4,179.73</td>
            <td id="value_9b_cdnr_total_cess">0.00</td>
        </tr>
        <tr>
            <td id="field_9b_cdnr_b2b_regular" colspan="8">Credit / Debit notes issued to registered person for taxable outward supplies in table 4 other than table 6 - B2B Regular</td>
        </tr>
        <tr>
            <td id="field_9b_cdnr_b2b_regular_net">Net Total (Debit notes – Credit notes)</td>
            <td id="value_9b_cdnr_b2b_regular_net_records">8</td>
            <td id="value_9b_cdnr_b2b_regular_net_document_type">Note</td>
            <td id="value_9b_cdnr_b2b_regular_net_value">-8,06,753.75</td>
            <td id="value_9b_cdnr_b2b_regular_net_integrated_tax">-1,32,446.22</td>
            <td id="value_9b_cdnr_b2b_regular_net_central_tax">-4,179.73</td>
            <td id="value_9b_cdnr_b2b_regular_net_state_tax">-4,179.73</td>
            <td id="value_9b_cdnr_b2b_regular_net_cess">0.00</td>
        </tr>
        <tr>
            <td id="field_9b_cdnr_b2b_reverse" colspan="8">Credit / Debit notes issued to registered person for taxable outward supplies in table 4 other than table 6 - B2B Reverse charge</td>
        </tr>
        <tr>
            <td id="field_9b_cdnr_b2b_reverse_net">Net Total (Debit notes – Credit notes)</td>
            <td id="value_9b_cdnr_b2b_reverse_net_records">0</td>
            <td id="value_9b_cdnr_b2b_reverse_net_document_type">Note</td>
            <td id="value_9b_cdnr_b2b_reverse_net_value">0.00</td>
            <td id="value_9b_cdnr_b2b_reverse_net_integrated_tax">0.00</td>
            <td id="value_9b_cdnr_b2b_reverse_net_central_tax">0.00</td>
            <td id="value_9b_cdnr_b2b_reverse_net_state_tax">0.00</td>
            <td id="value_9b_cdnr_b2b_reverse_net_cess">0.00</td>
        </tr>
        <tr>
            <td id="field_9b_cdnr_sez" colspan="8">Credit / Debit notes issued to registered person for taxable outward supplies in table 6B - SEZWP/SEZWOP</td>
        </tr>
        <tr>
            <td id="field_9b_cdnr_sez_net">Net Total (Debit notes – Credit notes)</td>
            <td id="value_9b_cdnr_sez_net_records">1</td>
            <td id="value_9b_cdnr_sez_net_document_type">Note</td>
            <td id="value_9b_cdnr_sez_net_value">-19,251.60</td>
            <td id="value_9b_cdnr_sez_net_integrated_tax">0.00</td>
            <td id="value_9b_cdnr_sez_net_central_tax">0.00</td>
            <td colspan="2"></td>
        </tr>
        <tr>
            <td id="field_9b_cdnr_de" colspan="8">Credit / Debit notes issued to registered person for taxable outward supplies in table 6C – DE</td>
        </tr>
        <tr>
            <td id="field_9b_cdnr_de_net">Net Total (Debit notes – Credit notes)</td>
            <td id="value_9b_cdnr_de_net_records">0</td>
            <td id="value_9b_cdnr_de_net_document_type">Note</td>
            <td id="value_9b_cdnr_de_net_value">0.00</td>
            <td id="value_9b_cdnr_de_net_integrated_tax">0.00</td>
            <td id="value_9b_cdnr_de_net_central_tax">0.00</td>
            <td id="value_9b_cdnr_de_net_state_tax">0.00</td>
            <td id="value_9b_cdnr_de_net_cess">0.00</td>
        </tr>
    </table>

    <!-- Section 9B - CDNUR -->
    <div id="section_9b_cdnur" class="section-header">9B - Credit/Debit Notes (Unregistered) – CDNUR</div>
    <table>
        <tr>
            <th>Description</th>
            <th>No. of records</th>
            <th>Document Type</th>
            <th>Value (₹)</th>
            <th>Integrated Tax (₹)</th>
            <th>Central Tax (₹)</th>
        </tr>
        <tr>
            <td id="field_9b_cdnur_total">Total - Net off debit/credit notes (Debit notes - Credit notes)</td>
            <td id="value_9b_cdnur_total_records">2</td>
            <td id="value_9b_cdnur_total_document_type">Note</td>
            <td id="value_9b_cdnur_total_value">-16,707.50</td>
            <td id="value_9b_cdnur_total_integrated_tax">0.00</td>
            <td id="value_9b_cdnur_total_central_tax">0.00</td>
        </tr>
        <tr>
            <td id="field_9b_cdnur_type" colspan="6">Unregistered Type</td>
        </tr>
        <tr>
            <td id="field_9b_cdnur_b2cl">-  B2CL</td>
            <td id="value_9b_cdnur_b2cl_records">0</td>
            <td id="value_9b_cdnur_b2cl_document_type">Note</td>
            <td id="value_9b_cdnur_b2cl_value">0.00</td>
            <td id="value_9b_cdnur_b2cl_integrated_tax">0.00</td>
            <td id="value_9b_cdnur_b2cl_central_tax">0.00</td>
        </tr>
        <tr>
            <td id="field_9b_cdnur_expwp">-  EXPWP</td>
            <td id="value_9b_cdnur_expwp_records">0</td>
            <td id="value_9b_cdnur_expwp_document_type">Note</td>
            <td id="value_9b_cdnur_expwp_value">0.00</td>
            <td id="value_9b_cdnur_expwp_integrated_tax">0.00</td>
            <td id="value_9b_cdnur_expwp_central_tax">0.00</td>
        </tr>
        <tr>
            <td id="field_9b_cdnur_expwop">-  EXPWOP</td>
            <td id="value_9b_cdnur_expwop_records">2</td>
            <td id="value_9b_cdnur_expwop_document_type">Note</td>
            <td id="value_9b_cdnur_expwop_value">-16,707.50</td>
            <td colspan="2"></td>
        </tr>
    </table>

    <!-- Section 9C - CDNRA -->
    <div id="section_9c_cdnra" class="section-header">9C - Amended Credit/Debit Notes (Registered) - CDNRA</div>
    <table>
        <tr>
            <th>Description</th>
            <th>No. of records</th>
            <th>Document Type</th>
            <th>Value (₹)</th>
            <th>Integrated Tax (₹)</th>
            <th>Central Tax (₹)</th>
            <th>State/UT Tax (₹)</th>
            <th>Cess (₹)</th>
        </tr>
        <tr>
            <td id="field_9c_cdnra_amended">Amended amount - Total</td>
            <td id="value_9c_cdnra_amended_records">0</td>
            <td id="value_9c_cdnra_amended_document_type">Note</td>
            <td id="value_9c_cdnra_amended_value">0.00</td>
            <td id="value_9c_cdnra_amended_integrated_tax">0.00</td>
            <td id="value_9c_cdnra_amended_central_tax">0.00</td>
            <td id="value_9c_cdnra_amended_state_tax">0.00</td>
            <td id="value_9c_cdnra_amended_cess">0.00</td>
        </tr>
        <tr>
            <td id="field_9c_cdnra_net">Net Differential amount (Net Amended Debit notes - Net Amended Credit notes) - Total</td>
            <td colspan="2"></td>
            <td id="value_9c_cdnra_net_value">0.00</td>
            <td id="value_9c_cdnra_net_integrated_tax">0.00</td>
            <td id="value_9c_cdnra_net_central_tax">0.00</td>
            <td id="value_9c_cdnra_net_state_tax">0.00</td>
            <td id="value_9c_cdnra_net_cess">0.00</td>
        </tr>
        <tr>
            <td id="field_9c_cdnra_b2b_regular" colspan="8">Amended Credit / Debit notes issued to registered person for taxable outward supplies in table 4 other than table 6 - B2B Regular</td>
        </tr>
        <tr>
            <td id="field_9c_cdnra_b2b_regular_net">Net total (Net Amended Debit notes - Net Amended Credit notes)</td>
            <td id="value_9c_cdnra_b2b_regular_net_records">0</td>
            <td id="value_9c_cdnra_b2b_regular_net_document_type">Note</td>
            <td id="value_9c_cdnra_b2b_regular_net_value">0.00</td>
            <td id="value_9c_cdnra_b2b_regular_net_integrated_tax">0.00</td>
            <td id="value_9c_cdnra_b2b_regular_net_central_tax">0.00</td>
            <td id="value_9c_cdnra_b2b_regular_net_state_tax">0.00</td>
            <td id="value_9c_cdnra_b2b_regular_net_cess">0.00</td>
        </tr>
        <tr>
            <td id="field_9c_cdnra_b2b_reverse" colspan="8">Amended Credit / Debit notes issued to registered person for taxable outward supplies in table 4 other than table 6 - B2B Reverse charge</td>
        </tr>
        <tr>
            <td id="field_9c_cdnra_b2b_reverse_net">Net total (Net Amended Debit notes - Net Amended Credit notes)</td>
            <td id="value_9c_cdnra_b2b_reverse_net_records">0</td>
            <td id="value_9c_cdnra_b2b_reverse_net_document_type">Note</td>
            <td id="value_9c_cdnra_b2b_reverse_net_value">0.00</td>
            <td id="value_9c_cdnra_b2b_reverse_net_integrated_tax">0.00</td>
            <td id="value_9c_cdnra_b2b_reverse_net_central_tax">0.00</td>
            <td id="value_9c_cdnra_b2b_reverse_net_state_tax">0.00</td>
            <td id="value_9c_cdnra_b2b_reverse_net_cess">0.00</td>
        </tr>
        <tr>
            <td id="field_9c_cdnra_sez" colspan="8">Amended Credit / Debit notes issued to registered person for taxable outward supplies in table 6B - SEZWP/SEZWOP</td>
        </tr>
        <tr>
            <td id="field_9c_cdnra_sez_net">Net total (Net Amended Debit notes - Net Amended Credit notes)</td>
            <td id="value_9c_cdnra_sez_net_records">0</td>
            <td id="value_9c_cdnra_sez_net_document_type">Note</td>
            <td id="value_9c_cdnra_sez_net_value">0.00</td>
            <td id="value_9c_cdnra_sez_net_integrated_tax">0.00</td>
            <td id="value_9c_cdnra_sez_net_central_tax">0.00</td>
            <td colspan="2"></td>
        </tr>
        <tr>
            <td id="field_9c_cdnra_de" colspan="8">Amended Credit / Debit notes issued to registered person for taxable outward supplies in table 6C – DE</td>
        </tr>
        <tr>
            <td id="field_9c_cdnra_de_net">Net total (Net Amended Debit notes - Net Amended Credit notes)</td>
            <td id="value_9c_cdnra_de_net_records">0</td>
            <td id="value_9c_cdnra_de_net_document_type">Note</td>
            <td id="value_9c_cdnra_de_net_value">0.00</td>
            <td id="value_9c_cdnra_de_net_integrated_tax">0.00</td>
            <td id="value_9c_cdnra_de_net_central_tax">0.00</td>
            <td id="value_9c_cdnra_de_net_state_tax">0.00</td>
            <td id="value_9c_cdnra_de_net_cess">0.00</td>
        </tr>
    </table>

    <!-- Section 9C - CDNURA -->
    <div id="section_9c_cdnura" class="section-header">9C - Amended Credit/Debit Notes (Unregistered) - CDNURA</div>
    <table>
        <tr>
            <th>Description</th>
            <th>No. of records</th>
            <th>Document Type</th>
            <th>Value (₹)</th>
            <th>Integrated Tax (₹)</th>
            <th>Central Tax (₹)</th>
        </tr>
        <tr>
            <td id="field_9c_cdnura_amended">Amended amount - Total</td>
            <td id="value_9c_cdnura_amended_records">0</td>
            <td id="value_9c_cdnura_amended_document_type">Note</td>
            <td id="value_9c_cdnura_amended_value">0.00</td>
            <td id="value_9c_cdnura_amended_integrated_tax">0.00</td>
            <td id="value_9c_cdnura_amended_central_tax">0.00</td>
        </tr>
        <tr>
            <td id="field_9c_cdnura_net">Net Differential amount (Net Amended Debit notes - Net Amended Credit notes) - Total</td>
            <td colspan="2"></td>
            <td id="value_9c_cdnura_net_value">0.00</td>
            <td id="value_9c_cdnura_net_integrated_tax">0.00</td>
            <td id="value_9c_cdnura_net_central_tax">0.00</td>
        </tr>
        <tr>
            <td id="field_9c_cdnura_type" colspan="6">Unregistered Type</td>
        </tr>
        <tr>
            <td id="field_9c_cdnura_b2cl">-  B2CL</td>
            <td id="value_9c_cdnura_b2cl_records">0</td>
            <td id="value_9c_cdnura_b2cl_document_type">Note</td>
            <td id="value_9c_cdnura_b2cl_value">0.00</td>
            <td id="value_9c_cdnura_b2cl_integrated_tax">0.00</td>
            <td id="value_9c_cdnura_b2cl_central_tax">0.00</td>
        </tr>
        <tr>
            <td id="field_9c_cdnura_expwp">-  EXPWP</td>
            <td id="value_9c_cdnura_expwp_records">0</td>
            <td id="value_9c_cdnura_expwp_document_type">Note</td>
            <td id="value_9c_cdnura_expwp_value">0.00</td>
            <td id="value_9c_cdnura_expwp_integrated_tax">0.00</td>
            <td id="value_9c_cdnura_expwp_central_tax">0.00</td>
        </tr>
        <tr>
            <td id="field_9c_cdnura_expwop">-  EXPWOP</td>
            <td id="value_9c_cdnura_expwop_records">0</td>
            <td id="value_9c_cdnura_expwop_document_type">Note</td>
            <td id="value_9c_cdnura_expwop_value">0.00</td>
            <td colspan="2"></td>
        </tr>
    </table>

    <!-- Section 10 -->
    <div id="section_10" class="section-header">10 - Amendment to taxable outward supplies made to unregistered person in returns for earlier tax periods in table 7 including supplies made through e-commerce operator attracting TCS - B2C (Others)</div>
    <div id="final_marker_3">FINAL</div>
    <table>
        <tr>
            <th>Description</th>
            <th>No. of records</th>
            <th>Document Type</th>
            <th>Value (₹)</th>
            <th>Integrated Tax (₹)</th>
            <th>Central Tax (₹)</th>
            <th>State/UT Tax (₹)</th>
            <th>Cess (₹)</th>
        </tr>
        <tr>
            <td id="field_10_amended">Amended amount - Total</td>
            <td id="value_10_amended_records">0</td>
            <td id="value_10_amended_document_type">Net Value</td>
            <td id="value_10_amended_value">0.00</td>
            <td id="value_10_amended_integrated_tax">0.00</td>
            <td id="value_10_amended_central_tax">0.00</td>
            <td id="value_10_amended_state_tax">0.00</td>
            <td id="value_10_amended_cess">0.00</td>
        </tr>
        <tr>
            <td id="field_10_net">Net differential amount (Amended - Original)</td>
            <td colspan="2"></td>
            <td id="value_10_net_value">0.00</td>
            <td id="value_10_net_integrated_tax">0.00</td>
            <td id="value_10_net_central_tax">0.00</td>
            <td id="value_10_net_state_tax">0.00</td>
            <td id="value_10_net_cess">0.00</td>
        </tr>
    </table>

    <!-- Section 11A -->
    <div id="section_11a" class="section-header">11A(1), 11A(2) - Advances received for which invoice has not been issued (tax amount to be added to the output tax liability) (Net of refund vouchers, if any)</div>
    <table>
        <tr>
            <th>Description</th>
            <th>No. of records</th>
            <th>Document Type</th>
            <th>Value (₹)</th>
            <th>Integrated Tax (₹)</th>
            <th>Central Tax (₹)</th>
            <th>State/UT Tax (₹)</th>
            <th>Cess (₹)</th>
        </tr>
        <tr>
            <td id="field_11a_total">Total</td>
            <td id="value_11a_records">0</td>
            <td id="value_11a_document_type">Net Value</td>
            <td id="value_11a_value">0.00</td>
            <td id="value_11a_integrated_tax">0.00</td>
            <td id="value_11a_central_tax">0.00</td>
            <td id="value_11a_state_tax">0.00</td>
            <td id="value_11a_cess">0.00</td>
        </tr>
    </table>

    <!-- Section 11B -->
    <div id="section_11b" class="section-header">11B(1), 11B(2) - Advance amount received in earlier tax period and adjusted against the supplies being shown in this tax period in Table Nos. 4, 5, 6 and 7 (Net of refund vouchers, if any)</div>
    <table>
        <tr>
            <th>Description</th>
            <th>No. of records</th>
            <th>Document Type</th>
            <th>Value (₹)</th>
            <th>Integrated Tax (₹)</th>
            <th>Central Tax (₹)</th>
            <th>State/UT Tax (₹)</th>
            <th>Cess (₹)</th>
        </tr>
        <tr>
            <td id="field_11b_total">Total</td>
            <td id="value_11b_records">0</td>
            <td id="value_11b_document_type">Net Value</td>
            <td id="value_11b_value">0.00</td>
            <td id="value_11b_integrated_tax">0.00</td>
            <td id="value_11b_central_tax">0.00</td>
            <td id="value_11b_state_tax">0.00</td>
            <td id="value_11b_cess">0.00</td>
        </tr>
    </table>

    <!-- Section 11A Amendment -->
    <div id="section_11a_amendment" class="section-header">11A - Amendment to advances received in returns for earlier tax periods in table 11A(1), 11A(2) (Net of refund vouchers, if any)</div>
    <table>
        <tr>
            <th>Description</th>
            <th>No. of records</th>
            <th>Document Type</th>
            <th>Value (₹)</th>
            <th>Integrated Tax (₹)</th>
            <th>Central Tax (₹)</th>
            <th>State/UT Tax (₹)</th>
            <th>Cess (₹)</th>
        </tr>
        <tr>
            <td id="field_11a_amendment_amended">Amended amount - Total</td>
            <td id="value_11a_amendment_amended_records">0</td>
            <td id="value_11a_amendment_amended_document_type">Net Value</td>
            <td id="value_11a_amendment_amended_value">0.00</td>
            <td id="value_11a_amendment_amended_integrated_tax">0.00</td>
            <td id="value_11a_amendment_amended_central_tax">0.00</td>
            <td id="value_11a_amendment_amended_state_tax">0.00</td>
            <td id="value_11a_amendment_amended_cess">0.00</td>
        </tr>
        <tr>
            <td id="field_11a_amendment_total">Total</td>
            <td colspan="2"></td>
            <td id="value_11a_amendment_total_value">0.00</td>
            <td id="value_11a_amendment_total_integrated_tax">0.00</td>
            <td id="value_11a_amendment_total_central_tax">0.00</td>
            <td id="value_11a_amendment_total_state_tax">0.00</td>
            <td id="value_11a_amendment_total_cess">0.00</td>
        </tr>
    </table>

    <!-- Section 11B Amendment -->
    <div id="section_11b_amendment" class="section-header">11B - Amendment to advances adjusted in returns for earlier tax periods in table 11B(1), 11B(2) (Net of refund vouchers, if any)</div>
    <table>
        <tr>
            <th>Description</th>
            <th>No. of records</th>
            <th>Document Type</th>
            <th>Value (₹)</th>
            <th>Integrated Tax (₹)</th>
            <th>Central Tax (₹)</th>
            <th>State/UT Tax (₹)</th>
            <th>Cess (₹)</th>
        </tr>
        <tr>
            <td id="field_11b_amendment_amended">Amended amount - Total</td>
            <td id="value_11b_amendment_amended_records">0</td>
            <td id="value_11b_amendment_amended_document_type">Net Value</td>
            <td id="value_11b_amendment_amended_value">0.00</td>
            <td id="value_11b_amendment_amended_integrated_tax">0.00</td>
            <td id="value_11b_amendment_amended_central_tax">0.00</td>
            <td id="value_11b_amendment_amended_state_tax">0.00</td>
            <td id="value_11b_amendment_amended_cess">0.00</td>
        </tr>
        <tr>
            <td id="field_11b_amendment_total">Total</td>
            <td colspan="2"></td>
            <td id="value_11b_amendment_total_value">0.00</td>
            <td id="value_11b_amendment_total_integrated_tax">0.00</td>
            <td id="value_11b_amendment_total_central_tax">0.00</td>
            <td id="value_11b_amendment_total_state_tax">0.00</td>
            <td id="value_11b_amendment_total_cess">0.00</td>
        </tr>
    </table>

    <!-- Section 12 -->
    <div id="section_12" class="section-header">12 - HSN-wise summary of outward supplies</div>
    <table>
        <tr>
            <th>Description</th>
            <th>No. of records</th>
            <th>Document Type</th>
            <th>Value (₹)</th>
            <th>Integrated Tax (₹)</th>
            <th>Central Tax (₹)</th>
            <th>State/UT Tax (₹)</th>
            <th>Cess (₹)</th>
        </tr>
        <tr>
            <td id="field_12_total">Total</td>
            <td id="value_12_records">10</td>
            <td id="value_12_document_type">NA</td>
            <td id="value_12_value">7,77,28,177.21</td>
            <td id="value_12_integrated_tax">3,16,842.15</td>
            <td id="value_12_central_tax">5,72,085.64</td>
            <td id="value_12_state_tax">5,72,085.64</td>
            <td id="value_12_cess">0.00</td>
        </tr>
    </table>

    <!-- Section 13 -->
    <div id="section_13" class="section-header">13 - Documents issued</div>
    <table>
        <tr>
            <th>Description</th>
            <th>Document Type</th>
        </tr>
        <tr>
            <td id="field_13_net_issued">Net issued documents</td>
            <td id="value_13_net_issued">489</td>
            <td id="value_13_document_type">All Documents</td>
        </tr>
    </table>

    <!-- Total Liability -->
    <table>
        <tr>
            <th colspan="8">Total Liability (Outward supplies other than Reverse charge)</th>
        </tr>
        <tr>
            <td id="field_total_liability" colspan="3"></td>
            <td id="value_total_liability_value">7,77,29,149.96</td>
            <td id="value_total_liability_integrated_tax">3,13,376.86</td>
            <td id="value_total_liability_central_tax">5,72,085.64</td>
            <td id="value_total_liability_state_tax">5,72,085.64</td>
            <td id="value_total_liability_cess">0.00</td>
        </tr>
    </table>`;
    }

    async processPDF() {
        if (!this.selectedFile) {
            this.showStatus('Please select a PDF file first.', 'error');
            return;
        }

        this.setProcessingState(true);
        this.showStatus('Processing PDF file...', 'info');

        try {
            const arrayBuffer = await this.selectedFile.arrayBuffer();
            const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
            
            let allText = '';
            
            // Extract text from all pages
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(' ');
                allText += pageText + ' ';
            }

            // Extract numerical values using regex
            this.extractedValues = this.extractNumericalValues(allText);
            
            if (this.extractedValues.length === 0) {
                this.showStatus('No numerical values found in the PDF.', 'error');
                this.setProcessingState(false);
                return;
            }

            // Update the HTML template with extracted values
            this.updateHTMLTemplate();
            
            // Update UI
            document.getElementById('extractedCount').value = this.extractedValues.length;
            // this.displayExtractedValues(); // Removed: function does not exist
            document.getElementById('downloadBtn').disabled = false;
            
            this.showStatus(`Successfully extracted ${this.extractedValues.length} numerical values from PDF.`, 'success');
            
        } catch (error) {
            console.error('Error processing PDF:', error);
            this.showStatus('Error processing PDF: ' + error.message, 'error');
        } finally {
            this.setProcessingState(false);
        }
    }

    updateHTMLTemplate() {
        // Define the mapping of extracted values to HTML element IDs
        // This mapping has been expanded to include all sections in the updated template
        const valueMapping = [
            // Basic information
            'value_financial_year',
            'value_tax_period',
            'value_1_gstin',
            'value_2a_legal_name',
            'value_2b_trade_name',
            'value_2c_arn',
            'value_2d_arn_date',
            
            // Section 4A - B2B Regular
            'value_4a_records',
            'value_4a_value',
            'value_4a_integrated_tax',
            'value_4a_central_tax',
            'value_4a_state_tax',
            'value_4a_cess',
            
            // Section 4B - B2B Reverse charge
            'value_4b_records',
            'value_4b_value',
            'value_4b_integrated_tax',
            'value_4b_central_tax',
            'value_4b_state_tax',
            'value_4b_cess',
            
            // Section 5 - B2CL
            'value_5_records',
            'value_5_value',
            'value_5_integrated_tax',
            'value_5_central_tax',
            
            // Section 6A - Exports
            'value_6a_records',
            'value_6a_value',
            'value_6a_integrated_tax',
            'value_6a_central_tax',
            'value_6a_expwp_records',
            'value_6a_expwp_value',
            'value_6a_expwp_integrated_tax',
            'value_6a_expwp_central_tax',
            'value_6a_expwop_records',
            'value_6a_expwop_value',
            
            // Section 6B - SEZ supplies
            'value_6b_records',
            'value_6b_value',
            'value_6b_integrated_tax',
            'value_6b_central_tax',
            'value_6b_sezwp_records',
            'value_6b_sezwp_value',
            'value_6b_sezwp_integrated_tax',
            'value_6b_sezwp_central_tax',
            'value_6b_sezwop_records',
            'value_6b_sezwop_value',
            
            // Section 6C - Deemed Exports
            'value_6c_records',
            'value_6c_value',
            'value_6c_integrated_tax',
            'value_6c_central_tax',
            'value_6c_state_tax',
            'value_6c_cess',
            
            // Section 7 - B2CS
            'value_7_records',
            'value_7_value',
            'value_7_integrated_tax',
            'value_7_central_tax',
            'value_7_state_tax',
            'value_7_cess',
            
            // Section 8 - Nil rated, exempted, non-GST
            'value_8_total',
            'value_8_nil',
            'value_8_exempted',
            'value_8_non_gst',
            
            // Section 9A - B2B Regular amendments
            'value_9a_b2b_regular_amended_records',
            'value_9a_b2b_regular_amended_value',
            'value_9a_b2b_regular_amended_integrated_tax',
            'value_9a_b2b_regular_amended_central_tax',
            'value_9a_b2b_regular_amended_state_tax',
            'value_9a_b2b_regular_amended_cess',
            'value_9a_b2b_regular_net_value',
            'value_9a_b2b_regular_net_integrated_tax',
            'value_9a_b2b_regular_net_central_tax',
            'value_9a_b2b_regular_net_state_tax',
            'value_9a_b2b_regular_net_cess',
            
            // Section 9A - B2B Reverse charge amendments
            'value_9a_b2b_reverse_amended_records',
            'value_9a_b2b_reverse_amended_value',
            'value_9a_b2b_reverse_amended_integrated_tax',
            'value_9a_b2b_reverse_amended_central_tax',
            'value_9a_b2b_reverse_amended_state_tax',
            'value_9a_b2b_reverse_amended_cess',
            'value_9a_b2b_reverse_net_value',
            'value_9a_b2b_reverse_net_integrated_tax',
            'value_9a_b2b_reverse_net_central_tax',
            'value_9a_b2b_reverse_net_state_tax',
            'value_9a_b2b_reverse_net_cess',
            
            // Section 9A - B2CL amendments
            'value_9a_b2cl_amended_records',
            'value_9a_b2cl_amended_value',
            'value_9a_b2cl_amended_integrated_tax',
            'value_9a_b2cl_amended_central_tax',
            'value_9a_b2cl_net_value',
            'value_9a_b2cl_net_integrated_tax',
            'value_9a_b2cl_net_central_tax',
            
            // Section 9A - Export amendments
            'value_9a_export_amended_records',
            'value_9a_export_amended_value',
            'value_9a_export_amended_integrated_tax',
            'value_9a_export_amended_central_tax',
            'value_9a_export_net_value',
            'value_9a_export_net_integrated_tax',
            'value_9a_export_net_central_tax',
            'value_9a_export_expwp_records',
            'value_9a_export_expwp_value',
            'value_9a_export_expwp_integrated_tax',
            'value_9a_export_expwp_central_tax',
            'value_9a_export_expwop_records',
            'value_9a_export_expwop_value',
            
            // Section 9A - SEZ amendments
            'value_9a_sez_amended_records',
            'value_9a_sez_amended_value',
            'value_9a_sez_amended_integrated_tax',
            'value_9a_sez_amended_central_tax',
            'value_9a_sez_net_value',
            'value_9a_sez_net_integrated_tax',
            'value_9a_sez_net_central_tax',
            'value_9a_sez_sezwp_records',
            'value_9a_sez_sezwp_value',
            'value_9a_sez_sezwp_integrated_tax',
            'value_9a_sez_sezwp_central_tax',
            'value_9a_sez_sezwop_records',
            'value_9a_sez_sezwop_value',
            
            // Section 9A - Deemed Exports amendments
            'value_9a_de_amended_records',
            'value_9a_de_amended_value',
            'value_9a_de_amended_integrated_tax',
            'value_9a_de_amended_central_tax',
            'value_9a_de_amended_state_tax',
            'value_9a_de_amended_cess',
            'value_9a_de_net_value',
            'value_9a_de_net_integrated_tax',
            'value_9a_de_net_central_tax',
            'value_9a_de_net_state_tax',
            'value_9a_de_net_cess',
            
            // Section 9B - CDNR
            'value_9b_cdnr_total_records',
            'value_9b_cdnr_total_value',
            'value_9b_cdnr_total_integrated_tax',
            'value_9b_cdnr_total_central_tax',
            'value_9b_cdnr_total_state_tax',
            'value_9b_cdnr_total_cess',
            'value_9b_cdnr_b2b_regular_net_records',
            'value_9b_cdnr_b2b_regular_net_value',
            'value_9b_cdnr_b2b_regular_net_integrated_tax',
            'value_9b_cdnr_b2b_regular_net_central_tax',
            'value_9b_cdnr_b2b_regular_net_state_tax',
            'value_9b_cdnr_b2b_regular_net_cess',
            'value_9b_cdnr_b2b_reverse_net_records',
            'value_9b_cdnr_b2b_reverse_net_value',
            'value_9b_cdnr_b2b_reverse_net_integrated_tax',
            'value_9b_cdnr_b2b_reverse_net_central_tax',
            'value_9b_cdnr_b2b_reverse_net_state_tax',
            'value_9b_cdnr_b2b_reverse_net_cess',
            'value_9b_cdnr_sez_net_records',
            'value_9b_cdnr_sez_net_value',
            'value_9b_cdnr_sez_net_integrated_tax',
            'value_9b_cdnr_sez_net_central_tax',
            'value_9b_cdnr_de_net_records',
            'value_9b_cdnr_de_net_value',
            'value_9b_cdnr_de_net_integrated_tax',
            'value_9b_cdnr_de_net_central_tax',
            'value_9b_cdnr_de_net_state_tax',
            'value_9b_cdnr_de_net_cess',
            
            // Section 9B - CDNUR
            'value_9b_cdnur_total_records',
            'value_9b_cdnur_total_value',
            'value_9b_cdnur_total_integrated_tax',
            'value_9b_cdnur_total_central_tax',
            'value_9b_cdnur_b2cl_records',
            'value_9b_cdnur_b2cl_value',
            'value_9b_cdnur_b2cl_integrated_tax',
            'value_9b_cdnur_b2cl_central_tax',
            'value_9b_cdnur_expwp_records',
            'value_9b_cdnur_expwp_value',
            'value_9b_cdnur_expwp_integrated_tax',
            'value_9b_cdnur_expwp_central_tax',
            'value_9b_cdnur_expwop_records',
            'value_9b_cdnur_expwop_value',
            
            // Section 9C - CDNRA
            'value_9c_cdnra_amended_records',
            'value_9c_cdnra_amended_value',
            'value_9c_cdnra_amended_integrated_tax',
            'value_9c_cdnra_amended_central_tax',
            'value_9c_cdnra_amended_state_tax',
            'value_9c_cdnra_amended_cess',
            'value_9c_cdnra_net_value',
            'value_9c_cdnra_net_integrated_tax',
            'value_9c_cdnra_net_central_tax',
            'value_9c_cdnra_net_state_tax',
            'value_9c_cdnra_net_cess',
            
            // Section 9C - CDNURA
            'value_9c_cdnura_amended_records',
            'value_9c_cdnura_amended_value',
            'value_9c_cdnura_amended_integrated_tax',
            'value_9c_cdnura_amended_central_tax',
            'value_9c_cdnura_net_value',
            'value_9c_cdnura_net_integrated_tax',
            'value_9c_cdnura_net_central_tax',
            
            // Section 10 - B2C amendments
            'value_10_amended_records',
            'value_10_amended_value',
            'value_10_amended_integrated_tax',
            'value_10_amended_central_tax',
            'value_10_amended_state_tax',
            'value_10_amended_cess',
            'value_10_net_value',
            'value_10_net_integrated_tax',
            'value_10_net_central_tax',
            'value_10_net_state_tax',
            'value_10_net_cess',
            
            // Section 11A - Advances received
            'value_11a_records',
            'value_11a_value',
            'value_11a_integrated_tax',
            'value_11a_central_tax',
            'value_11a_state_tax',
            'value_11a_cess',
            
            // Section 11B - Advances adjusted
            'value_11b_records',
            'value_11b_value',
            'value_11b_integrated_tax',
            'value_11b_central_tax',
            'value_11b_state_tax',
            'value_11b_cess',
            
            // Section 11A - Advances amendments
            'value_11a_amendment_amended_records',
            'value_11a_amendment_amended_value',
            'value_11a_amendment_amended_integrated_tax',
            'value_11a_amendment_amended_central_tax',
            'value_11a_amendment_amended_state_tax',
            'value_11a_amendment_amended_cess',
            'value_11a_amendment_total_value',
            'value_11a_amendment_total_integrated_tax',
            'value_11a_amendment_total_central_tax',
            'value_11a_amendment_total_state_tax',
            'value_11a_amendment_total_cess',
            
            // Section 11B - Advances adjusted amendments
            'value_11b_amendment_amended_records',
            'value_11b_amendment_amended_value',
            'value_11b_amendment_amended_integrated_tax',
            'value_11b_amendment_amended_central_tax',
            'value_11b_amendment_amended_state_tax',
            'value_11b_amendment_amended_cess',
            'value_11b_amendment_total_value',
            'value_11b_amendment_total_integrated_tax',
            'value_11b_amendment_total_central_tax',
            'value_11b_amendment_total_state_tax',
            'value_11b_amendment_total_cess',
            
            // Section 12 - HSN summary
            'value_12_records',
            'value_12_value',
            'value_12_integrated_tax',
            'value_12_central_tax',
            'value_12_state_tax',
            'value_12_cess',
            
            // Section 13 - Documents issued
            'value_13_net_issued',
            
            // Total liability
            'value_total_liability_value',
            'value_total_liability_integrated_tax',
            'value_total_liability_central_tax',
            'value_total_liability_state_tax',
            'value_total_liability_cess'
        ];

        // Create a temporary DOM element to manipulate the HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(this.htmlTemplate, 'text/html');

        // Update values in the HTML
        this.extractedValues.forEach((value, index) => {
            if (index < valueMapping.length) {
                const elementId = valueMapping[index];
                const element = doc.getElementById(elementId);
                if (element) {
                    element.textContent = value;
                }
            }
        });

        // Convert back to HTML string
        this.updatedHTML = '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;
    }

    extractNumericalValues(text) {
        // Enhanced regex to match various number formats including:
        // - Simple numbers: 123, 0.00
        // - Numbers with commas: 1,234.56
        // - Numbers with Indian formatting: 1,23,456.78
        // - Negative numbers: -123.45
        // - Also match ARN numbers with letters and digits
        const numberRegex = /-?\d{1,3}(?:,\d{2,3})*(?:\.\d{2})?|\d+(?:\.\d{2})?|[A-Z0-9]+/g;
        const matches = text.match(numberRegex) || [];
        
        // Filter and clean the matches
        return matches
            .filter(match => {
                // Keep ARN numbers and dates
                if (/[A-Z]/.test(match)) return true;
                
                // Filter out single digits that might be page numbers or section numbers
                const cleanNumber = match.replace(/,/g, '');
                return !isNaN(parseFloat(cleanNumber)) && cleanNumber.length > 1;
            })
            .map(match => match.trim())
            .filter(match => match.length > 0);
    }

    async downloadHTML() {
        if (!this.updatedHTML) {
            this.showStatus('No processed HTML available for download.', 'error');
            return;
        }

        const fileName = document.getElementById('outputFileName').value.trim() || 'updated-template';
        const blob = new Blob([this.updatedHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName.endsWith('.html') ? fileName : fileName + '.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showStatus('HTML file downloaded successfully!', 'success');
    }

    setProcessingState(processing) {
        const processBtn = document.getElementById('processBtn');
        const processText = document.getElementById('processText');
        const processLoading = document.getElementById('processLoading');
        
        if (processing) {
            processBtn.disabled = true;
            processText.style.display = 'none';
            processLoading.style.display = 'inline-block';
        } else {
            processBtn.disabled = false;
            processText.style.display = 'inline';
            processLoading.style.display = 'none';
        }
    }

    showStatus(message, type) {
        const status = document.getElementById('status');
        status.textContent = message;
        status.className = `status ${type}`;
        status.style.display = 'block';
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                status.style.display = 'none';
            }, 5000);
        }
    }
}

// Global functions for button onclick handlers
let app;

function processPDF() {
    app.processPDF();
}

function downloadHTML() {
    app.downloadHTML();
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    app = new PDFHTMLUpdater();
});