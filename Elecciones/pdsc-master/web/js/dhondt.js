function dhondtHistory(data){
        var electionType = data.configuration.type;
        var threshold = data.configuration.threshold;
        var month = data.configuration.month;
        var year = data.configuration.year;
        var representatives = data.configuration.representatives;
        var totalResult = [];
        data.districts.forEach( function(district) {
            result = [{name : district.name, blank : district.blank, null : district.null, representatives : district.representatives}];
            var total = 0;
            var distributedVotes = [];
            var cand = [];
            
            district.candidatures.forEach( function(candidature){
            
                total = total + candidature.votes;
                cand.push([candidature]);
                
            },this);
            
            district.candidatures.forEach( function(candidature){
                if(candidature.votes > ((threshold/100)*total)){
                    for (i = 1; i <= district.representatives; i++){
                            distributedVotes.push([candidature.shortName,candidature.votes/i]);
                        }
                }
                
            },this);
            
            distributedVotes.sort(sortVotes).length = district.representatives;

            
            cand.forEach(function(candName){
                points = 0;
                distributedVotes.forEach(function(point){
                    if(candName[0].shortName === point[0]){
                        points = points + 1;
                    }
                
                },this);
                result.push([candName[0],points]);
                
            },this);
            totalResult.push(result);
            
        },this);
        return totalResult;
    }
    
function sortVotes(a,b){
    if (a[1] === b[1]){
        return 0;
    }else{
        return (a[1] > b[1]) ? -1 : 1;
    }
}
