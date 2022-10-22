const sleep = ms => new Promise(r => setTimeout(r, ms));

$( document ).ready(function() {
    $('#form1-t').hide();
    $('#form1-w').hide();
    $('#features6-1c').hide();
    $('#news_full').hide();
    $('#url-alert-row').hide();
    $('#pipeline2-container-row').hide()
});

function poll_result(req_id) {
    value = $.ajax({
        url: $SCRIPT_ROOT + '/predict_status',
        data: { "request_id" : req_id },
        async: false
    }).responseText
    return JSON.parse(value)
};

function tooltip_content() {
    domain = $(this).attr("data-domain");
    title = $(this).attr("data-headline");
    content = $(this).attr("data-content");
    return "<b>"+title+"</b> (<emph>"+domain+"</emph>) <br><br>"+content;
}

function toggle_tooltip() {
    options = {
        position: { my: "left+3 bottom-3", at: "right center" },
        track: true,
        content: tooltip_content
    };
    $('[data-toggle="tooltip"]').uitooltip(options);
}

function spawn_arrows(explanation) {
    final_output = "";
    for (let i = 0; i < explanation.length; i++) {
        color = "#45c720";
        arrow = "&#129049;";
        if (explanation[i][2] < 0) {
            color = "#eb4034";
            arrow = "&#129051;";
        }
        abs_value = Math.abs(explanation[i][2]);
        Feat_Name = explanation[i][0];
        Feat_Value = "Value = "+explanation[i][1];
        Feat_Expl = explanation[i][3];
        final_output += '<div><span class="tooltip_our" data-toggle="tooltip" data-placement="bottom" title="Tooltip not working" data-domain = "'+ Feat_Value+'" data-headline = "'+Feat_Name+'" data-content="'+Feat_Expl+'">' + explanation[i][0] + '&nbsp;</span>';
        final_output += '<span style="color: '+color+'; font-size:36px;">'
        for (let j = 0; j < abs_value; j++) {
            final_output += arrow;
        }
        final_output += "</span></div>";
        if (i+1 < explanation.length) {
            final_output += "<br>\n";
        }
    }
    return final_output;
}

function put_highlighted_text(highlight,split_info,target1,target2,target3) {
    highlighted_text = ["","",""];
    for (let i = 0; i < highlight.length; i++) {
        j = 0;
        if (i >= split_info[0]) {
            j = 1;
        }
        if (i >= split_info[1]) {
            j = 2;
        }
        word = highlight[i][0];
        label = highlight[i][1];
        new_span = "";
        if (label == "Unknown") {
            //new_span = '<span style="background-color:rgba(255,255,0);">' + (word) + '</span>';
            new_span = '<span>' + (word) + '</span>';
        } else {
            Domain_of_Source = highlight[i][3];
            Title_of_Source = highlight[i][4];
            Sentence = highlight[i][5];
            weight = highlight[i][2];
            min_alpha_real = highlight[i][7];
            max_alpha_real = highlight[i][6];
            color = "linear-gradient(to right, rgba(255,255,255,0) 50%, rgba(0,128,0,";
            class_name = "tooltip_our real";
            if (label == "Fake") {
                color = "linear-gradient(to right, rgba(255,255,255,0) 50%, rgba(255,0,0,"
                class_name = "tooltip_our fake";
            }
            new_span = '<span class="'+class_name+'" data-toggle="tooltip" data-placement="bottom" title="Tooltip not working" data-domain = "'+ Domain_of_Source+'" data-headline = "'+Title_of_Source+'" data-content="'+Sentence+'" style= "background-image:' + color + String(( 1.05*weight-min_alpha_real)/(max_alpha_real-min_alpha_real)) + ') 50%);">' + (word) + '</span>';
        }
        highlighted_text[j] += new_span + "\n";
    }
    $(target1).html(highlighted_text[0]);
    $(target2).html(highlighted_text[1]);
    $(target3).html(highlighted_text[2]);
    toggle_tooltip();
}

function predict2_btn_func(event) {
    $('#url-alert-row').show();
    $('#news_full').hide();
    $('#url_alert').text("Let the magic begin for Pipeline 2!");
    $("#preview-verdict").text("");
    $('#features6-1c').hide();
    $('#pipeline2-container-row').waitMe({
        effect : 'bounce',
        text : '',
        bg : 'rgba(255,255,255,1)',
        color : 'rgba(0,0,0,1)',
        maxSize : '',
        waitTime : -1,
        textPos : 'horizontal',
        fontSize : '',
        source : '',
        onClose : function() {}
    });
    $.getJSON($SCRIPT_ROOT + '/predict2', {
        request_id: $('input[name="req_id"]').val(),
        type: event.data.type_var
    }, async function(data) {
        while (data.response.status == 0) {
            await sleep(1000);
            data = poll_result(data.request_id);
            $('#url_alert').text(data.response.message);
        }
        $('#features6-1c').show();
        $('#news-full-title').text(data.response.title);
        $('#feature_contribution_container').html(spawn_arrows(data.response.explanation));
        put_highlighted_text(data.response.attribution, data.response.split_info, '#news-text-full-p1', '#news-text-full-p2', '#news-text-full-p3');
        $('#news-full-quote').text(data.response.quote);
        $('#news_full').show();
        $("#preview-verdict").text(data.response.prediction);
        $('#pipeline2-container-row').waitMe("hide");
        $('#pipeline2-container-row').hide();
        put_quick_verdict('#quick_verdict', data.response.status);
        $('#btn-real-fake').show();
        if (data.response.wizardry) {
            $('#show_expl').show();
        } else {
            $('#show_expl').hide();
        }
        $('#form1-t').hide();
        if (data.response.status != 2) {
            $([document.documentElement, document.body]).animate({
                scrollTop: $("#news_full").offset().top
            }, 200);
        }
    });
}

function put_quick_verdict(tag,status) {
    label = "FAKE";
    image_src = "assets/images/dumbledore-no.gif";
    useless_quote = "Fake is worrying";
    if (status > 0) {
        label = "REAL";
        useless_quote = "Real is better";
        image_src = "assets/images/hermione-yes.gif";
    }
    if (status == 2 || status == -2) {
        label = "BORDERLINE<br>"+label;
    }
    color = "#eb4034";
    if (status == -2) {
        color = "#e8827b";
    } else if (status == 1) {
        color = "#45c720";
    } else if (status == 2) {
        color = "#89cf76";
    }
    $(tag).html(label);
    $(tag).css("background-color",color);
    $(tag).css("text-align","center");
    $('#useless_quote').text(useless_quote);
    $('#image_in_news').attr("src", image_src);
}

function url_revel_btn(event) {
    $('#feature_contribution_container').html("You might see some magic here.");
    $('#features6-1c').hide();
    $('#btn-real-fake').hide();
    $('#news_full').hide();
    $("#preview-verdict").text("");
    $('#url_alert').text("Let the magic begin!");
    $('#url-alert-row').show();
    $('#url-container-row').waitMe({
        effect : 'bounce',
        text : '',
        bg : 'rgba(255,255,255,1)',
        color : 'rgba(0,0,0,1)',
        maxSize : '',
        waitTime : -1,
        textPos : 'horizontal',
        fontSize : '',
        source : '',
        onClose : function() {}
    });
    text_name = 'textarea[name="text_body"]'
    title_name = "title"
    if (event.data.url) {
        text_name = 'input[name="url_text"]'
        title_name = "title_hidden"
    }
    $.getJSON($SCRIPT_ROOT + '/predict1', {
        text: $(text_name).val(),
        title: $('input[name="'+title_name+'"]').val()
    }, async function(data) {
        while (data.response.status == 0) {
            await sleep(1000);
            data = poll_result(data.request_id);
            $('#url_alert').text(data.response.message);
        }
        if (Math.abs(data.response.status) == 2) {
            $('#pipeline2-container-row').show();
            $('#url-container-row').hide();
            $('#url-alert-row').hide();
            $('#req_id_form').val(data.request_id);
        } else {
            $('#form1-t').hide();
        }
        $('#features6-1c').show();
        $('#news-full-title').text(data.response.title);
        $('#feature_contribution_container').html(spawn_arrows(data.response.explanation));
        toggle_tooltip();
        $('#news-text-full-p1').text(data.response.split_text[0]);
        $('#news-text-full-p2').text(data.response.split_text[1]);
        $('#news-text-full-p3').text(data.response.split_text[2]);
        put_quick_verdict('#quick_verdict', data.response.status);
        $('#news-full-quote').text(data.response.quote);
        $('#news_full').show();
        $("#preview-verdict").text(data.response.prediction);
        $('#url-container-row').waitMe("hide");
        if (Math.abs(data.response.status) != 2) {
            $([document.documentElement, document.body]).animate({
                scrollTop: $("#news_full").offset().top
            }, 200);
        }
    });
    return false;
}

function url_scroll_btn(event) {
    url = event.data.url;
    $('#form1-t').show();
    $('#form1-w').hide();
    $('#features6-1c').hide();
    $('#pipeline2-container-row').hide();
    $('#url-container-row').show();
    $('#url-alert-row').hide();
    if (url) {
        $('#url_input_div').show();
        $('#text_input_div').hide();
        $('input[name="url_text"]').val("");
    } else {
        $('#url_input_div').hide();
        $('#text_input_div').show();
        $('textarea[name="text_body"]').val("");
        $('input[name="title"]').val("");
    }
    $([document.documentElement, document.body]).animate({
        scrollTop: $('#form1-t').offset().top
    }, 200);
    $('#url-revelio-btn').bind('click', {url: url}, url_revel_btn);
}

$(function() {
    $('#show_real').bind('click', function() {
        if ($(this).text() == "Show Real") {
            $(this).text("Hide Real");
            $('.tooltip_our.real').addClass('tooltip_our_shown');
        } else {
            $(this).text("Show Real");
            $('.tooltip_our.real').removeClass('tooltip_our_shown');
        }
    });
    $('#show_fake').bind('click', function() {
        if ($(this).text() == "Show Fake") {
            $(this).text("Hide Fake");
            $('.tooltip_our.fake').addClass('tooltip_our_shown');
        } else {
            $(this).text("Show Fake");
            $('.tooltip_our.fake').removeClass('tooltip_our_shown');
        }
    });

    $('#predict2-no-btn').bind('click', function() {
        $([document.documentElement, document.body]).animate({
            scrollTop: $("#news_full").offset().top
        }, 200);
    });
    $('#predict2-yes-btn').bind('click', { type_var: 0 }, predict2_btn_func);
    $('#predict2-yes-btn-wo-zeroshot').bind('click', { type_var: 1 }, predict2_btn_func);
    $('#url-btn-scroll').bind('click', {url: true}, url_scroll_btn);
    $('#custom-btn-scroll').bind('click', {url: false}, url_scroll_btn);
    $('#url_input_div').hide();
    $('#text_input_div').hide();
});

