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
    </table>
    <!-- Verification -->
        <div class="footer">
        <p id="verification_text">Verification:</p>
        <p id="verification_declaration">
            I hereby solemnly affirm and declare that the information given herein above is true and correct to the best of my knowledge and belief and nothing has been concealed there from and in case of any information being found untrue, I shall be liable for prosecution under the law.
        </p>
        </div>
    </body>
    </html>`;
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
            
            // Extract text from all pages with better positioning information
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                
                // Sort items by their vertical position (y coordinate)
                // This helps maintain reading order
                const sortedItems = textContent.items.sort((a, b) => {
                    const yDiff = b.transform[5] - a.transform[5]; // y-coordinate comparison (top to bottom)
                    if (Math.abs(yDiff) > 5) return yDiff; // If items are on different lines
                    return a.transform[4] - b.transform[4]; // x-coordinate comparison (left to right)
                });
                
                // Join all text items with spaces
                const pageText = sortedItems.map(item => item.str).join(' ');
                allText += pageText + '\n\n'; // Add line breaks between pages
            }

        console.log('Extracted text from PDF:', allText);

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
        this.displayExtractedValues();
        document.getElementById('downloadBtn').disabled = false;
        
        this.showStatus(`Successfully extracted ${this.extractedValues.length} numerical values from PDF.`, 'success');
        
    } catch (error) {
        console.error('Error processing PDF:', error);
        this.showStatus('Error processing PDF: ' + error.message, 'error');
    } finally {
        this.setProcessingState(false);
    }
}

extractNumericalValues(text) {
    // Improved multi-stage extraction process
    
    // First, identify key sections in the text
    const sections = this.identifySections(text);
    
    // A collection to store all our found values with context
    let extractedValues = [];
    
    // Patterns for different types of values
    const patterns = [
        // Common financial amounts with commas and decimals
        { 
            regex: /-?(?:[\d,]+\.\d{2})/g,
            type: 'amount'
        },
        // Whole numbers (records counts)
        {
            regex: /\b\d{1,4}\b(?!\.\d)/g,
            type: 'count'
        },
        // GSTINs
        {
            regex: /[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{1}[Z]{1}[0-9A-Z]{1}/g,
            type: 'gstin'
        },
        // ARNs
        {
            regex: /[A-Z]{2}[0-9]{10}[A-Z0-9]/g,
            type: 'arn'
        },
        // Dates
        {
            regex: /\d{2}\/\d{2}\/\d{4}/g,
            type: 'date'
        },
        // Year ranges (like 2022-23)
        {
            regex: /\d{4}-\d{2}/g,
            type: 'year'
        }
    ];

    // Process each section to extract values
    for (const [sectionName, sectionText] of Object.entries(sections)) {
        // Apply each regex pattern to the section
        for (const pattern of patterns) {
            const matches = [...sectionText.matchAll(pattern.regex)];
            
            for (const match of matches) {
                extractedValues.push({
                    value: match[0],
                    type: pattern.type,
                    section: sectionName,
                    context: this.getTextContext(sectionText, match.index)
                });
            }
        }
    }
    
    console.log('Extracted structured values:', extractedValues);
    
    // Extract values for HTML updating - we'll use the context to improve matching
    return extractedValues.map(item => {
        // Create a value object with additional context for better matching
        return {
            value: item.value,
            type: item.type,
            section: item.section,
            context: item.context
        };
    });
}

// Helper method to identify sections in the document
identifySections(text) {
    const sections = {
        'header': '',
        'section_4a': '',
        'section_4b': '',
        'section_5': '',
        'section_6a': '',
        'section_6b': '',
        'section_6c': '',
        'section_7': '',
        'section_8': '',
        'section_9': '',
        'section_12': '',
        'total': ''
    };
    
    // Very simple section extraction - look for section identifiers
    if (text.includes('GSTR-1') || text.includes('GSTIN')) {
        const headerEnd = text.indexOf('4A');
        if (headerEnd > 0) {
            sections.header = text.substring(0, headerEnd);
        }
    }
    
    // Extract section 4A
    const section4AStart = text.indexOf('4A');
    const section4BStart = text.indexOf('4B');
    if (section4AStart > 0 && section4BStart > section4AStart) {
        sections.section_4a = text.substring(section4AStart, section4BStart);
    }
    
    // Extract section 4B
    const section5Start = text.indexOf('5 -');
    if (section4BStart > 0 && section5Start > section4BStart) {
        sections.section_4b = text.substring(section4BStart, section5Start);
    }
    
    // Extract other sections similarly
    const section6AStart = text.indexOf('6A');
    if (section5Start > 0 && section6AStart > section5Start) {
        sections.section_5 = text.substring(section5Start, section6AStart);
    }
    
    const section6BStart = text.indexOf('6B');
    if (section6AStart > 0 && section6BStart > section6AStart) {
        sections.section_6a = text.substring(section6AStart, section6BStart);
    }
    
    const section6CStart = text.indexOf('6C');
    if (section6BStart > 0 && section6CStart > section6BStart) {
        sections.section_6b = text.substring(section6BStart, section6CStart);
    }
    
    const section7Start = text.indexOf('7 -');
    if (section6CStart > 0 && section7Start > section6CStart) {
        sections.section_6c = text.substring(section6CStart, section7Start);
    }
    
    const section8Start = text.indexOf('8 -');
    if (section7Start > 0 && section8Start > section7Start) {
        sections.section_7 = text.substring(section7Start, section8Start);
    }
    
    const section9Start = text.indexOf('9');
    if (section8Start > 0 && section9Start > section8Start) {
        sections.section_8 = text.substring(section8Start, section9Start);
    }
    
    const section12Start = text.indexOf('12 -');
    if (section9Start > 0 && section12Start > section9Start) {
        sections.section_9 = text.substring(section9Start, section12Start);
    }
    
    const totalStart = text.indexOf('Total Liability');
    if (section12Start > 0 && totalStart > section12Start) {
        sections.section_12 = text.substring(section12Start, totalStart);
    }
    
    if (totalStart > 0) {
        sections.total = text.substring(totalStart);
    }
    
    return sections;
}

// Helper to get text context around a match
getTextContext(text, index, contextSize = 50) {
    const start = Math.max(0, index - contextSize);
    const end = Math.min(text.length, index + contextSize);
    return text.substring(start, end);
}

updateHTMLTemplate() {
    // Create a temporary DOM element to manipulate the HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(this.htmlTemplate, 'text/html');
    
    // Get all value elements in the HTML
    const valueElements = Array.from(doc.querySelectorAll('[id^="value_"]'));
    
    // Map extracted values to HTML elements based on intelligent matching
    this.mapValuesToHTML(valueElements, doc);
    
    // Convert back to HTML string
    this.updatedHTML = '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;
}

mapValuesToHTML(valueElements, doc) {
    // Helper function to set element value
    const setElementValue = (element, value) => {
        if (element && value) {
            element.textContent = value;
        }
    };

    // 1. First, handle special identification fields
    // GSTIN
    const gstinValue = this.extractedValues.find(item => item.type === 'gstin');
    if (gstinValue) {
        setElementValue(doc.getElementById('value_1_gstin'), gstinValue.value);
    }
    
    // ARN
    const arnValue = this.extractedValues.find(item => item.type === 'arn');
    if (arnValue) {
        setElementValue(doc.getElementById('value_2c_arn'), arnValue.value);
    }
    
    // Date
    const dateValue = this.extractedValues.find(item => item.type === 'date');
    if (dateValue) {
        setElementValue(doc.getElementById('value_2d_arn_date'), dateValue.value);
    }
    
    // Financial year
    const yearValue = this.extractedValues.find(item => item.type === 'year');
    if (yearValue) {
        setElementValue(doc.getElementById('value_financial_year'), yearValue.value);
    }
    
    // 2. Process section 4A values (we know these are important)
    const section4AValues = this.extractedValues.filter(item => item.section === 'section_4a');
    
    // Find count value in section 4A
    const section4ACount = section4AValues.find(item => 
        item.type === 'count' && item.context.includes('records')
    );
    if (section4ACount) {
        setElementValue(doc.getElementById('value_4a_records'), section4ACount.value);
    }
    
    // Find monetary values in section 4A (value, taxes)
    const section4AAmounts = section4AValues.filter(item => item.type === 'amount');
    if (section4AAmounts.length >= 5) {
        // Assume order: value, integrated_tax, central_tax, state_tax, cess
        setElementValue(doc.getElementById('value_4a_value'), section4AAmounts[0].value);
        setElementValue(doc.getElementById('value_4a_integrated_tax'), section4AAmounts[1].value);
        setElementValue(doc.getElementById('value_4a_central_tax'), section4AAmounts[2].value);
        setElementValue(doc.getElementById('value_4a_state_tax'), section4AAmounts[3].value);
        setElementValue(doc.getElementById('value_4a_cess'), section4AAmounts[4].value);
    }
    
    // 3. Process section 6A values (exports)
    const section6AValues = this.extractedValues.filter(item => item.section === 'section_6a');
    
    // Find count value in section 6A
    const section6ACount = section6AValues.find(item => 
        item.type === 'count' && item.context.includes('records')
    );
    if (section6ACount) {
        setElementValue(doc.getElementById('value_6a_records'), section6ACount.value);
        setElementValue(doc.getElementById('value_6a_expwop_records'), section6ACount.value); // Same value for EXPWOP
    }
    
    // Find main value in section 6A
    const section6AAmount = section6AValues.find(item => 
        item.type === 'amount' && !item.context.includes('tax')
    );
    if (section6AAmount) {
        setElementValue(doc.getElementById('value_6a_value'), section6AAmount.value);
        setElementValue(doc.getElementById('value_6a_expwop_value'), section6AAmount.value);
    }
    
    // 4. Process section 12 and total values
    const section12Values = this.extractedValues.filter(item => item.section === 'section_12');
    const totalValues = this.extractedValues.filter(item => item.section === 'total');
    
    // Find counts and amounts in section 12
    const section12Count = section12Values.find(item => item.type === 'count');
    if (section12Count) {
        setElementValue(doc.getElementById('value_12_records'), section12Count.value);
    }
    
    // Find all amount values in section 12
    const section12Amounts = section12Values.filter(item => item.type === 'amount');
    if (section12Amounts.length >= 5) {
        setElementValue(doc.getElementById('value_12_value'), section12Amounts[0].value);
        setElementValue(doc.getElementById('value_12_integrated_tax'), section12Amounts[1].value);
        setElementValue(doc.getElementById('value_12_central_tax'), section12Amounts[2].value);
        setElementValue(doc.getElementById('value_12_state_tax'), section12Amounts[3].value);
        setElementValue(doc.getElementById('value_12_cess'), section12Amounts[4].value);
    }
    
    // Process total liability
    const totalAmounts = totalValues.filter(item => item.type === 'amount');
    if (totalAmounts.length >= 4) {
        setElementValue(doc.getElementById('value_total_liability_value'), totalAmounts[0].value);
        setElementValue(doc.getElementById('value_total_liability_integrated_tax'), totalAmounts[1].value);
        setElementValue(doc.getElementById('value_total_liability_central_tax'), totalAmounts[2].value);
        setElementValue(doc.getElementById('value_total_liability_state_tax'), totalAmounts[3].value);
    }
    
    // Set all other fields to 0.00 if they haven't been set and are numeric fields
    valueElements.forEach(element => {
        if (!element.textContent && element.id.match(/_value$|_tax$|_records$|_cess$/)) {
            if (element.id.includes('_records')) {
                element.textContent = '0';
            } else {
                element.textContent = '0.00';
            }
        }
    });
}

displayExtractedValues() {
    const valuesGrid = document.getElementById('valuesGrid');
    const previewSection = document.getElementById('previewSection');
    
    valuesGrid.innerHTML = '';
    
    // Group values by section for better display
    const groupedValues = {};
    this.extractedValues.forEach(item => {
        if (!groupedValues[item.section]) {
            groupedValues[item.section] = [];
        }
        groupedValues[item.section].push(item);
    });
    
    // Create section headers and display values
    for (const [section, values] of Object.entries(groupedValues)) {
        // Create section header
        const sectionHeader = document.createElement('div');
        sectionHeader.className = 'section-header';
        sectionHeader.style.gridColumn = '1 / -1';
        sectionHeader.style.marginTop = '10px';
        sectionHeader.style.fontWeight = 'bold';
        sectionHeader.textContent = section.replace('_', ' ').toUpperCase();
        valuesGrid.appendChild(sectionHeader);
        
        // Add values from this section
        values.forEach((item, index) => {
            const valueItem = document.createElement('div');
            valueItem.className = 'value-item';
            valueItem.textContent = `${item.type}: ${item.value}`;
            valuesGrid.appendChild(valueItem);
        });
    }
    
    previewSection.style.display = 'block';
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